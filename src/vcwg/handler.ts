import fs from 'fs'
import * as jose from 'jose'
import { Arguments } from "../types"
import neo4j from 'neo4j-driver'

import yaml from 'yaml'

import { setSecret, setOutput, debug, getInput } from '@actions/core'
import * as cose from '@transmute/cose'

import { env } from '../action'

import * as vc from '@transmute/verifiable-credentials'

import { jsongraph } from './graph/jsongraph'
import { query, injection } from './graph/gql'

export const handler = async function ({ positionals, values }: Arguments) {
  positionals = positionals.slice(1)
  const operation = positionals.shift()
  switch (operation) {
    case 'issuer-claims': {
      const output = values.output
      const verbose = values.verbose || false
      const [pathToJson] = positionals
      const jsonClaims = JSON.parse(fs.readFileSync(pathToJson).toString())
      const yamlClaims = yaml.stringify(jsonClaims)
      if (verbose) {
        const message = yamlClaims
        debug(message)
      }
      if (output) {
        fs.writeFileSync(output, yamlClaims)
      } else {
        if (env.github()) {
          setOutput('yaml', yamlClaims)
        } else {
          console.log(yamlClaims)
        }
      }
      break
    }
    case 'issue-credential': {
      const output = values.output
      const credentialType = values['credential-type'] as any
      const verbose = values.verbose || false
      const [pathToPrivateKey, pathToClaimsetYaml] = positionals
      const privateKey = JSON.parse(fs.readFileSync(pathToPrivateKey).toString()) as jose.JWK
      if (env.github()) {
        if (privateKey.d) {
          setSecret(privateKey.d)
        }
      }
      if (verbose) {
        const message = `🔑 ${privateKey.kid}`
        debug(message)
      }
      const alg: any = privateKey.alg || values.alg
      if (!alg) {
        const message = `❌ --alg is required when not present in private key`
        console.error(message)
        throw new Error(message)
      }
      const kid = privateKey.kid || values.kid
      const c = await vc.issuer({
        alg,
        type: credentialType,
        signer: {
          sign: async (bytes: Uint8Array) => {
            if (credentialType.includes('+cose')) {
              const signer = cose.attached.signer({
                remote: cose.crypto.signer({
                  privateKeyJwk: await vc.key.importJWK({
                    type: "application/jwk+json",
                    content: vc.text.encoder.encode(JSON.stringify(privateKey))
                  })
                })
              })
              const iana = Object.values(cose.IANACOSEAlgorithms).find((a) => {
                return a.Name === alg
              })
              const algValue = iana ? parseInt(iana?.Value, 10) : -7
              const signature = await signer.sign({
                protectedHeader: new Map([[1, algValue]]),
                unprotectedHeader: new Map(),
                payload: bytes
              })
              return new Uint8Array(signature)
            } else {
              const jws = await new jose.CompactSign(bytes)
                .setProtectedHeader({ kid, alg })
                .sign(
                  await jose.importJWK(privateKey)
                );
              return vc.text.encoder.encode(jws);
            }

          },
        },
      }).issue({
        claimset: fs.readFileSync(pathToClaimsetYaml)
      })
      if (output) {
        fs.writeFileSync(output, Buffer.from(c))
      }
      if (env.github()) {
        if (credentialType.endsWith('+jwt')) {
          setOutput('jwt', vc.text.decoder.decode(c))
        }
        if (credentialType.endsWith('+sd-jwt')) {
          setOutput('sd-jwt', vc.text.decoder.decode(c))
        }
        if (credentialType.endsWith('+cose')) {
          setOutput('cbor', Buffer.from(c).toString('hex'))
        }
      } else {
        if (!output) {
          if (credentialType.endsWith('+jwt')) {
            console.log(vc.text.decoder.decode(c))
          }
          if (credentialType.endsWith('+sd-jwt')) {
            console.log(vc.text.decoder.decode(c))
          }
          if (credentialType.endsWith('+cose')) {
            console.log(Buffer.from(c).toString('hex'))
          }
        }
      }
      break
    }
    case 'verify-credential': {
      const output = values.output
      const inputContentType = values['credential-type'] as any
      const verbose = values.verbose || false
      const [pathToPublicKey, pathToCredential] = positionals
      const publicKey = JSON.parse(fs.readFileSync(pathToPublicKey).toString()) as jose.JWK
      if (verbose) {
        const message = `🔑 ${publicKey.kid}`
        debug(message)
      }
      const alg = publicKey.alg || values.alg
      if (!alg) {
        const message = `❌ --alg is required when not present in public key`
        console.error(message)
        throw new Error(message)
      }
      const validated = await vc
        .validator({
          resolver: {
            resolve: async ({ id, type, content }) => {
              if (content != undefined && type === inputContentType) {
                return {
                  type: "application/jwk+json",
                  content: vc.text.encoder.encode(JSON.stringify(publicKey))
                }
              }
            },
          }
          ,
        }).validate({ type: inputContentType, content: fs.readFileSync(pathToCredential) })
      if (!validated.verified) {
        throw new Error('Credential verification failed.')
      }
      if (output) {
        fs.writeFileSync(output, JSON.stringify(validated, null, 2))
      }
      if (env.github()) {
        setOutput('json', validated)
      } else {
        if (!output) {
          console.log(JSON.stringify(validated, null, 2))
        }
      }
      break
    }
    case 'issue-presentation': {
      const output = values.output
      const credentialType = values['credential-type'] as any
      const presentationType = values['presentation-type'] as any
      const verbose = values.verbose || false
      const [pathToPrivateKey, pathToCredential, pathToHolderDisclosureYaml] = positionals
      const privateKey = JSON.parse(fs.readFileSync(pathToPrivateKey).toString()) as jose.JWK
      if (env.github()) {
        if (privateKey.d) {
          setSecret(privateKey.d)
        }
      }
      if (verbose) {
        const message = `🔑 ${privateKey.kid}`
        debug(message)
      }
      const alg: any = privateKey.alg || values.alg
      if (!alg) {
        const message = `❌ --alg is required when not present in private key`
        console.error(message)
        throw new Error(message)
      }
      const kid = privateKey.kid || values.kid
      const sub = values.sub
      const c = await vc.holder({
        alg,
        type: presentationType,
      }).issue({
        presentation: {
          "@context": ["https://www.w3.org/ns/credentials/v2"],
          type: ["VerifiablePresentation"],
          holder: sub,
          // this part is built from disclosures without key binding below.
          // "verifiableCredential": [{
          //   "@context": "https://www.w3.org/ns/credentials/v2",
          //   "id": "data:application/vc-ld+sd-jwt;QzVjV...RMjU",
          //   "type": "EnvelopedVerifiableCredential"
          // }]
        },
        disclosures: [
          {
            type: credentialType,
            credential: fs.readFileSync(pathToCredential),
            disclosure: pathToHolderDisclosureYaml ? fs.readFileSync(pathToHolderDisclosureYaml) : undefined
          },
        ],
        signer: {
          sign: async (bytes: Uint8Array) => {
            if (credentialType.includes('+cose')) {
              const signer = cose.attached.signer({
                remote: cose.crypto.signer({
                  privateKeyJwk: await vc.key.importJWK({
                    type: "application/jwk+json",
                    content: vc.text.encoder.encode(JSON.stringify(privateKey))
                  })
                })
              })
              const iana = Object.values(cose.IANACOSEAlgorithms).find((a) => {
                return a.Name === alg
              })
              const algValue = iana ? parseInt(iana?.Value, 10) : -7
              const signature = await signer.sign({
                protectedHeader: new Map([[1, algValue]]),
                unprotectedHeader: new Map(),
                payload: bytes
              })
              return new Uint8Array(signature)
            } else {
              const jws = await new jose.CompactSign(bytes)
                .setProtectedHeader({ kid, alg })
                .sign(
                  await jose.importJWK(privateKey)
                );
              return vc.text.encoder.encode(jws);
            }
          },
        },
      })
      if (output) {
        fs.writeFileSync(output, c)
      }
      if (env.github()) {
        if (presentationType.endsWith('+jwt')) {
          setOutput('jwt', vc.text.decoder.decode(c))
        }
        if (presentationType.endsWith('+sd-jwt')) {
          setOutput('sd-jwt', vc.text.decoder.decode(c))
        }
        if (presentationType.endsWith('+cose')) {
          setOutput('cbor', Buffer.from(c).toString('hex'))
        }
      } else {
        if (!output) {
          if (presentationType.endsWith('+jwt')) {
            console.log(vc.text.decoder.decode(c))
          }
          if (presentationType.endsWith('+sd-jwt')) {
            console.log(vc.text.decoder.decode(c))
          }
          if (presentationType.endsWith('+cose')) {
            console.log(Buffer.from(c).toString('hex'))
          }
        }
      }
      break
    }
    case 'verify-presentation': {
      const output = values.output
      const presentationType = values['presentation-type'] as any
      const verbose = values.verbose || false
      const [pathToPublicKey, pathToCredential] = positionals
      const publicKey = JSON.parse(fs.readFileSync(pathToPublicKey).toString()) as jose.JWK
      if (verbose) {
        const message = `🔑 ${publicKey.kid}`
        debug(message)
      }
      const alg = publicKey.alg || values.alg
      if (!alg) {
        const message = `❌ --alg is required when not present in public key`
        console.error(message)
        throw new Error(message)
      }
      const validated = await vc
        .validator({
          resolver: {
            resolve: async ({ id, type, content }) => {
              if (content != undefined && type === presentationType) {
                return {
                  type: "application/jwk+json",
                  content: vc.text.encoder.encode(JSON.stringify(publicKey))
                }
              }
            },
          }
          ,
        }).validate({ type: presentationType, content: fs.readFileSync(pathToCredential) })
      if (!validated.verified) {
        throw new Error('Presentation verification failed.')
      }
      if (output) {
        fs.writeFileSync(output, JSON.stringify(validated, null, 2))
      }
      if (env.github()) {
        setOutput('json', validated)
      } else {
        if (!output) {
          console.log(JSON.stringify(validated, null, 2))
        }
      }
      break
    }
    case 'graph': {
      const graphType = values['graph-type'] || 'application/vnd.jgf+json'
      const output = values.output
      const contentType: any = values['credential-type'] || values['presentation-type']
      const verbose = values.verbose || false
      const [pathToContent] = positionals
      const content = new Uint8Array(fs.readFileSync(pathToContent))
      const graph = await jsongraph.graph(content, contentType)
      let graphText = JSON.stringify(graph, null, 2)
      if (verbose) {
        const message = `🕸️ ${graphType}`
        debug(message)
      }
      if (graphType === 'application/gql') {
        const components = await query(graph)
        const dangerousQuery = await injection(components)
        graphText = dangerousQuery
        if (values.push) {
          const driver = neo4j.driver(
            `${process.env.NEO4J_URI || getInput("neo4j-uri")}`,
            neo4j.auth.basic(`${process.env.NEO4J_USERNAME || getInput("neo4j-user")}`, `${process.env.NEO4J_PASSWORD || getInput("neo4j-password")}`)
          )
          const session = driver.session()
          await session
            .run({ text: `${components.query}`, parameters: components.params })
          await driver.close()
        }
      }
      if (output) {
        fs.writeFileSync(output, JSON.stringify(graphText, null, 2))
      }
      if (env.github()) {
        if (graphType === 'application/gql') {
          setOutput('gql', graphText)
        }
        if (graphType === 'application/vnd.jgf+json') {
          setOutput('json', graph)
        }
      } else {
        if (!output) {
          console.log(graphText)
        }
      }
      break
    }

    default: {
      const message = `😕 Unknown Command`
      console.error(message)
      throw new Error(message)
    }
  }

}