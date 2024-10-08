import fs from 'fs'
import * as cose from '@transmute/cose'
import * as edn from '@transmute/edn'
import { Arguments } from "../types"

import { setSecret, setOutput, debug } from '@actions/core'

import { env } from '../action'

export const handler = async function ({ positionals, values }: Arguments) {
  positionals = positionals.slice(1)
  const operation = positionals.shift()
  switch (operation) {
    case 'keygen': {
      const output = values.output
      const alg = values.alg || 'ES256'
      const verbose = values.verbose || false
      const privateKey = await cose.key.generate<Map<any, any>>(alg as any, 'application/cose-key')
      const thumbprint: any = privateKey.get(2) || await cose.key.thumbprint.calculateCoseKeyThumbprint(privateKey)
      if (verbose) {
        const message = `🔑 ${Buffer.from(thumbprint).toString('hex')}`
        debug(message)
      }
      if (output) {
        fs.writeFileSync(output, cose.cbor.encode(privateKey))
      }
      const encoded = Buffer.from(cose.cbor.encode(privateKey))
      if (env.github()) {
        const d = privateKey.get(-4)
        if (d) {
          setSecret(Buffer.from(d).toString('hex'))
        }
        setOutput('cbor', encoded.toString('hex'))
      } else {
        if (!output) {
          // const text = await edn.render(encoded, 'application/cbor-diagnostic')
          const text = await cose.cbor.diagnose(encoded)
          console.log(text)
        }
      }
      break
    }
    case 'keypub': {
      const output = values.output
      const verbose = values.verbose || false
      const [pathToPrivateKey] = positionals
      const privateKey = cose.cbor.decode(fs.readFileSync(pathToPrivateKey))
      if (env.github()) {
        if (privateKey.get(-4)) {
          setSecret(privateKey.get(-4))
        }
      }
      const publicKey = cose.key.extractPublicCoseKey(privateKey)
      const thumbprint: any = publicKey.get(2) || await cose.key.thumbprint.calculateCoseKeyThumbprint(publicKey)
      if (verbose) {
        const message = `🔑 ${Buffer.from(thumbprint).toString('hex')}`
        debug(message)
      }
      const encoded = cose.cbor.encode(publicKey)
      if (output) {
        fs.writeFileSync(output, encoded)
      }
      if (env.github()) {
        setOutput('cbor', Buffer.from(encoded).toString('hex'))
      } else {
        if (!output) {
          const text = await cose.cbor.diagnose(encoded)
          console.log(text)
        }
      }
      break
    }
    case 'sign': {
      const output = values.output
      const detached = values.detached || false
      const verbose = values.verbose || false
      const [pathToPrivateKey, pathToMessage] = positionals
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
      const message = fs.readFileSync(pathToMessage)
      let coseSign1
      if (detached) {
        const signer = cose.detached.signer({
          remote: cose.crypto.signer({
            privateKeyJwk: await cose.key.convertCoseKeyToJsonWebKey(privateKey),
          }),
        })
        coseSign1 = await signer.sign({
          protectedHeader: cose.ProtectedHeader([
            [cose.Protected.Alg, privateKey.get(3)],
            // TODO: other commmand line options for headers
          ]),
          unprotectedHeader: new Map<any, any>(),
          payload: message,
        })
      } else {
        const signer = cose.attached.signer({
          remote: cose.crypto.signer({
            privateKeyJwk: await cose.key.convertCoseKeyToJsonWebKey(privateKey),
          }),
        })

        coseSign1 = await signer.sign({
          protectedHeader: cose.ProtectedHeader([
            [cose.Protected.Alg, privateKey.get(3)],
            // TODO: other commmand line options for headers
          ]),
          unprotectedHeader: new Map<any, any>(),
          payload: message,
        })
      }

      if (output) {
        fs.writeFileSync(output, Buffer.from(coseSign1))
      }

      if (env.github()) {
        setOutput('cbor', Buffer.from(coseSign1).toString('hex'))
      } else {
        if (!output) {
          const text = await edn.render(Buffer.from(coseSign1), 'application/cbor-diagnostic')
          // const text = await cose.cbor.diagnose(sign1)
          console.log(text)
        }
      }
      break
    }
    case 'verify': {
      const output = values.output
      const verbose = values.verbose || false
      const detached = values.detached || false
      const [pathToPublicKey, pathToSignatures, pathToMessage] = positionals
      const publicKey = cose.cbor.decode(fs.readFileSync(pathToPublicKey))
      const thumbprint: any = publicKey.get(2) || await cose.key.thumbprint.calculateCoseKeyThumbprint(publicKey)
      if (verbose) {
        const message = `🔑 ${Buffer.from(thumbprint).toString('hex')}`
        debug(message)
      }
      if (env.github()) {
        if (publicKey.get(-4)) {
          setSecret(Buffer.from(publicKey.get(-4)).toString('hex'))
        }
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
      let result
      if (detached) {
        const verifier = cose.detached.verifier({
          resolver: {
            resolve: async () => {
              return cose.key.convertCoseKeyToJsonWebKey(publicKey)
            }
          }
        })
        result = await verifier.verify({
          payload: fs.readFileSync(pathToMessage),
          coseSign1
        })
      } else {
        const verifier = cose.attached.verifier({
          resolver: {
            resolve: async () => {
              return cose.key.convertCoseKeyToJsonWebKey(publicKey)
            }
          }
        })
        result = await verifier.verify({
          coseSign1
        })
      }

      if (output) {
        fs.writeFileSync(output, Buffer.from(result))
      }
      if (env.github()) {
        setOutput('cbor', Buffer.from(result).toString('hex'))
      } else {
        if (!output) {
          const text = await edn.render(Buffer.from(coseSign1), 'application/cbor-diagnostic')
          // const text = await cose.cbor.diagnose(sign1)
          console.log(text)
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