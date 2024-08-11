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
    case 'sign': {
      const output = values.output
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
      const coseSign1 = await cose.hash
        .signer({
          remote: cose.crypto.signer({
            privateKeyJwk: await cose.key.convertCoseKeyToJsonWebKey(privateKey),
          }),
        })
        .sign({
          protectedHeader: cose.ProtectedHeader([
            [cose.Protected.Alg, privateKey.get(3)],
            [cose.Protected.PayloadHashAlgorithm, cose.Hash.SHA256],
            // TODO: other commmand line options for headers
          ]),
          unprotectedHeader: new Map<any, any>(),
          payload: message,
        })

      if (output) {
        fs.writeFileSync(output, Buffer.from(coseSign1))
      }

      if (env.github()) {
        setOutput('cbor', Buffer.from(coseSign1).toString('hex'))
      } else {
        const text = await cose.cbor.diagnose(Buffer.from(coseSign1))
        console.log(text)
      }
      break
    }
    case 'verify': {
      const output = values.output
      const verbose = values.verbose || false
      const [pathToPublicKey, pathToSignatures, hash] = positionals
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
      const result = await cose.attached
        .verifier({
          resolver: {
            resolve: async () => {
              return cose.key.convertCoseKeyToJsonWebKey(publicKey)
            }
          }
        })
        .verify({
          coseSign1
        })
      if (hash) {
        if (hash.toLowerCase() !== Buffer.from(result).toString('hex')) {
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
        const text = await cose.cbor.diagnose(Buffer.from(coseSign1))
        console.log(text)
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