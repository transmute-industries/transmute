import fs from 'fs'
import * as cose from '@transmute/cose'
import moment from 'moment'
import { setSecret, setOutput, debug, getInput } from '@actions/core'
import { ClientSecretCredential } from "@azure/identity";
import * as akv from '@transmute/azure-keyvault-cose-sign'
import dotenv from 'dotenv'

import { Arguments } from "../types"
import { env } from '../action'
import { base64url } from 'jose'

const getAzureCredential = () => {
  const tenantId = `${process.env.AZURE_TENANT_ID || getInput("azure-tenant-id")}`
  const clientId = `${process.env.AZURE_CLIENT_ID || getInput("azure-client-id")}`
  const clientSecret = `${process.env.AZURE_CLIENT_SECRET || getInput("azure-client-secret")}`
  if (env.github()) {
    setSecret(clientSecret)
  }
  return new ClientSecretCredential(tenantId, clientId, clientSecret);
}

const getAzureKid = (verbose) => {
  const kid = `${process.env.AZURE_KEY_ID || getInput("azure-kid")}`
  if (verbose) {
    const message = `🔑 ${kid}`
    debug(message)
  }
  return kid
}

export const handler = async function ({ positionals, values }: Arguments) {
  positionals = positionals.slice(1)
  const operation = positionals.shift()
  switch (operation) {
    case 'export-remote-public-key': {
      const output = values.output
      const verbose = values.verbose || false
      const envFile = values.env
      if (envFile) {
        dotenv.config({ path: envFile })
      }
      if (values['azure-keyvault'] === true) {
        const kid = getAzureKid(verbose)
        const credential = getAzureCredential()
        const publicKeyJwk = await akv.jose.getPublicKey({ credential, kid })
        const coseKey = await cose.key.convertJsonWebKeyToCoseKey(publicKeyJwk)
        const encodedCoseKey = cose.cbor.encode(coseKey)
        if (output) {
          fs.writeFileSync(output, encodedCoseKey)
        }
        if (env.github()) {
          setOutput('cbor', Buffer.from(encodedCoseKey).toString('hex'))
        } else {
          if (!output) {
            const text = await cose.cbor.diagnose(encodedCoseKey)
            console.log(text)
          }
        }
      }
      break
    }
    case 'issue-statement': {
      const output = values.output
      const verbose = values.verbose || false
      let alg = values.alg
      const envFile = values.env
      if (envFile) {
        dotenv.config({ path: envFile })
      }
      let signer
      let statement
      if (values['azure-keyvault'] === true) {
        const kid = getAzureKid(verbose)
        const credential = getAzureCredential()
        signer = cose.hash
          .signer({
            remote: await akv.cose.remote({ credential, kid, alg: 'ES256' })
          })
        const [pathToStatement] = positionals
        statement = fs.readFileSync(pathToStatement)
      } else {
        const [pathToPrivateKey, pathToStatement] = positionals
        const privateKey = cose.cbor.decode(fs.readFileSync(pathToPrivateKey))
        const thumbprint: any = privateKey.get(2) || await cose.key.thumbprint.calculateCoseKeyThumbprint(privateKey)
        if (verbose) {
          const message = `🔑 ${Buffer.from(thumbprint).toString('hex')}`
          debug(message)
        }
        if (env.github()) {
          if (privateKey.get(-4)) {
            setSecret(Buffer.from(privateKey.get(-4)).toString('hex'))
          }
        }
        if (privateKey.get(3)) {
          alg = cose.IANACOSEAlgorithms[`${privateKey.get(3)}`].Name
        }
        signer = cose.hash
          .signer({
            remote: cose.crypto.signer({
              privateKeyJwk: await cose.key.convertCoseKeyToJsonWebKey(privateKey),
            }),
          })
        statement = fs.readFileSync(pathToStatement)
      }
      if (!alg) {
        const message = `❌ --alg is required when not present in private key`
        console.error(message)
        throw new Error(message)
      }
      const headerParamEntries = [
        [cose.Protected.Alg, cose.Signature.ES256],
        [cose.Protected.PayloadHashAlgorithm, cose.Hash.SHA256],
        // TODO: other commmand line options for headers
      ] as cose.HeaderMapEntry[]
      const cwtClaimsInHeader = new Map<any, any>()
      cwtClaimsInHeader.set(6, moment().unix()) // iat now
      if (values['content-type']) {
        headerParamEntries.push([cose.Protected.PayloadPreImageContentType, values['content-type']])
      }
      if (values['location']) {
        headerParamEntries.push([cose.Protected.PayloadLocation, values['location']])
      }
      if (values.iss || values.sub) {
        // https://www.iana.org/assignments/cwt/cwt.xhtml
        if (values.iss) {
          cwtClaimsInHeader.set(1, values.iss)
        }
        if (values.sub) {
          cwtClaimsInHeader.set(2, values.sub)
        }
      }
      headerParamEntries.push([cose.Protected.CWTClaims, cwtClaimsInHeader])
      const coseSign1 = await
        signer.sign({
          protectedHeader: cose.ProtectedHeader(headerParamEntries),
          unprotectedHeader: new Map<any, any>(),
          payload: statement,
        })

      if (output) {
        fs.writeFileSync(output, Buffer.from(coseSign1))
      }

      if (env.github()) {
        setOutput('cbor', Buffer.from(coseSign1).toString('hex'))
      } else {
        if (!output) {
          const text = await cose.cbor.diagnose(Buffer.from(coseSign1))
          console.log(text)
        }
      }
      break
    }
    case 'verify-statement-hash': {
      const output = values.output
      const verbose = values.verbose || false
      const envFile = values.env
      if (envFile) {
        dotenv.config({ path: envFile })
      }
      const [pathToPublicKey, pathToSignatures, hashToCheck] = positionals
      const publicKey = cose.cbor.decode(fs.readFileSync(pathToPublicKey))
      const thumbprint: any = publicKey.get(2) || await cose.key.thumbprint.calculateCoseKeyThumbprint(publicKey)
      if (verbose) {
        const message = `🔑 ${Buffer.from(thumbprint).toString('hex')}`
        debug(message)
      }
      let alg = values.alg
      if (publicKey.get(3)) {
        alg = cose.IANACOSEAlgorithms[`${publicKey.get(3)}`].Name
      }
      if (!alg) {
        const message = `❌ --alg is required when not present in public key`
        console.error(message)
        throw new Error(message)
      }
      const coseSign1 = fs.readFileSync(pathToSignatures)
      const verifier = await cose.attached
        .verifier({
          resolver: {
            resolve: async () => {
              return cose.key.convertCoseKeyToJsonWebKey(publicKey)
            }
          }
        })
      const result = await verifier.verify({
        coseSign1
      })
      if (hashToCheck) {
        if (hashToCheck.toLowerCase() !== Buffer.from(result).toString('hex')) {
          throw new Error(`Signature verification failed for hash: ${Buffer.from(result).toString('hex')}`)
        }
      } else {
        throw new Error(`Unable to verify signature for hash: ${Buffer.from(result).toString('hex')}`)
      }
      if (output) {
        fs.writeFileSync(output, Buffer.from(result))
      }
      if (env.github()) {
        setOutput('cbor', Buffer.from(result).toString('hex'))
      } else {
        if (!output) {
          const statement = await cose.cbor.decodeFirst(coseSign1)
          const statementHeader = cose.cbor.decode(statement.value[0])
          const statementClaims = statementHeader.get(cose.Protected.CWTClaims)
          console.log('✅ Statement Verified')
          console.log(`File: ${Buffer.from(result).toString('hex')}`)
          if (statementClaims.get(1)) {
            console.log(`Producer: ${statementClaims.get(1)} `)
          }
        }
      }
      break
    }
    case 'issue-receipt': {
      const log = values.log
      const output = values.output
      const verbose = values.verbose || false
      const envFile = values.env
      if (envFile) {
        dotenv.config({ path: envFile })
      }
      if (!log) {
        const message = `❌ --log is required(only JSON is supported)`
        console.error(message)
        throw new Error(message)
      }
      let notary
      let signedStatement
      if (values['azure-keyvault'] === true) {
        const kid = getAzureKid(verbose)
        const credential = getAzureCredential()
        const [pathToSignedStatement] = positionals
        signedStatement = fs.readFileSync(pathToSignedStatement)
        notary = cose.detached.signer({
          remote: await akv.cose.remote({ credential, kid, alg: 'ES256' })
        });
      } else {
        const [pathToPrivateKey, pathToSignedStatement] = positionals
        const privateKey = cose.cbor.decode(fs.readFileSync(pathToPrivateKey))
        const thumbprint: any = privateKey.get(2) || await cose.key.thumbprint.calculateCoseKeyThumbprint(privateKey)
        if (verbose) {
          const message = `🔑 ${Buffer.from(thumbprint).toString('hex')}`
          debug(message)
        }
        if (env.github()) {
          if (privateKey.get(-4)) {
            setSecret(Buffer.from(privateKey.get(-4)).toString('hex'))
          }
        }
        let alg = values.alg
        if (privateKey.get(3)) {
          alg = cose.IANACOSEAlgorithms[`${privateKey.get(3)}`].Name
        }
        if (!alg) {
          const message = `❌ --alg is required when not present in private key`
          console.error(message)
          throw new Error(message)
        }
        signedStatement = fs.readFileSync(pathToSignedStatement)
        notary = cose.detached.signer({
          remote: cose.crypto.signer({
            privateKeyJwk: await cose.key.convertCoseKeyToJsonWebKey(privateKey),
          }),
        });
      }
      let entries = [] as Uint8Array[]
      try {
        entries = JSON.parse(fs.readFileSync(log).toString()).entries.map((leaf) => {
          return base64url.decode(leaf)
        })
      } catch (e) {
        // console.warn('failed to parse transparency log.')
      }
      const headerParamEntries = [
        [cose.Protected.Alg, cose.Signature.ES256],
        [cose.Protected.VerifiableDataStructure, cose.VerifiableDataStructures['RFC9162-Binary-Merkle-Tree']],
        // TODO: other commmand line options for headers
      ] as cose.HeaderMapEntry[]
      const cwtClaimsInHeader = new Map<any, any>()
      cwtClaimsInHeader.set(6, moment().unix()) // iat now
      if (values.iss || values.sub) {
        // https://www.iana.org/assignments/cwt/cwt.xhtml
        if (values.iss) {
          cwtClaimsInHeader.set(1, values.iss)
        }
        if (values.sub) {
          cwtClaimsInHeader.set(2, values.sub)
        }
      }
      headerParamEntries.push([cose.Protected.CWTClaims, cwtClaimsInHeader])
      const newLeaf = await cose.receipt.leaf(signedStatement)
      entries.push(newLeaf)
      const receipt = await cose.receipt.inclusion.issue({
        protectedHeader: cose.ProtectedHeader(headerParamEntries),
        entry: entries.length - 1,
        entries: entries,
        signer: notary,
      });
      const encodedLog = entries.map((leaf) => {
        return base64url.encode(leaf)
      })
      const transparentStatement = await cose.receipt.add(
        signedStatement,
        receipt
      );
      if (output) {
        // write log to disk before writing receipt.
        fs.writeFileSync(log, JSON.stringify({ entries: encodedLog }, null, 2))
        fs.writeFileSync(output, Buffer.from(transparentStatement))
      }
      if (env.github()) {
        setOutput('cbor', Buffer.from(transparentStatement).toString('hex'))
      } else {
        if (!output) {
          const text = await cose.cbor.diagnose(Buffer.from(transparentStatement))
          console.log(text)
        }
      }
      break
    }
    case 'verify-receipt-hash': {
      const output = values.output
      const verbose = values.verbose || false
      const [pathToPublicKey, pathToSignatures, hash] = positionals
      const publicKey = cose.cbor.decode(fs.readFileSync(pathToPublicKey))
      const thumbprint: any = publicKey.get(2) || await cose.key.thumbprint.calculateCoseKeyThumbprint(publicKey)
      if (verbose) {
        const message = `🔑 ${Buffer.from(thumbprint).toString('hex')}`
        debug(message)
      }
      const verifier = await cose.receipt.verifier({
        resolve: async (): Promise<cose.PublicKeyJwk> => {
          // TODO: could add support for resolve key from identifier here.
          return await cose.key.convertCoseKeyToJsonWebKey(publicKey)
        }
      });
      const transparentStatement = fs.readFileSync(pathToSignatures)
      const verified = await verifier.verify({
        coseSign1: transparentStatement,
        payload: Buffer.from(hash, 'hex'),
      });
      const root = Buffer.from(verified.receipts[0]).toString('hex')
      if (Buffer.from(verified.payload).toString('hex') !== Buffer.from(hash, 'hex').toString('hex')) {
        throw new Error(`Signature verification failed for hash: ${Buffer.from(verified.payload).toString('hex')} `)
      }
      if (output) {
        fs.writeFileSync(output, Buffer.from(verified.payload))
      }
      if (env.github()) {
        setOutput('cbor', Buffer.from(verified.payload).toString('hex'))
      } else {
        if (!output) {
          console.log('✅ Receipt Verified')
          console.log(`Log: ${root} `)
          console.log(`File: ${hash} `)
          const statement = await cose.cbor.decodeFirst(transparentStatement)
          const statementHeader = cose.cbor.decode(statement.value[0])
          const [encodedReceipt] = statement.value[1].get(cose.Unprotected.Receipts)
          const decodedReceipt = cose.cbor.decode(encodedReceipt)
          const receiptHeader = cose.cbor.decode(decodedReceipt.value[0])
          const receiptClaims = receiptHeader.get(cose.Protected.CWTClaims)
          const statementClaims = statementHeader.get(cose.Protected.CWTClaims)
          if (receiptClaims.get(1)) {
            console.log(`Notary: ${receiptClaims.get(1)} `)
          }
          if (statementClaims.get(1)) {
            console.log(`Producer: ${statementClaims.get(1)} `)
          }
          if (receiptClaims.get(2)) {
            console.log(`Product: ${receiptClaims.get(2)} `)
          }
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