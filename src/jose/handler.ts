import fs from 'fs'
import * as jose from 'jose'
import { Arguments } from "../types"

import { setSecret, setOutput, debug } from '@actions/core'

import { env } from '../action'

const prettyKey = (k: jose.JWK) => {
  const { kid, kty, crv, alg, x, y, d } = k
  return { kid, kty, crv, alg, x, y, d }
}

const toPublicKey = (k: jose.JWK) => {
  const { kid, kty, crv, alg, x, y, } = k
  return { kid, kty, crv, alg, x, y, }
}

export const handler = async function ({ positionals, values }: Arguments) {
  positionals = positionals.slice(1)
  const operation = positionals.shift()
  switch (operation) {
    case 'keygen': {
      const alg = values.alg || 'ES256'
      const crv = values.crv || 'Ed25519'
      const verbose = values.verbose || false
      const k = await jose.generateKeyPair(alg, { crv })
      const privateKey = await jose.exportJWK(k.privateKey)
      privateKey.kid = await jose.calculateJwkThumbprint(privateKey)
      privateKey.alg = alg
      if (verbose) {
        const message = `🔑 ${privateKey.kid}`
        debug(message)
      }
      const output = prettyKey(privateKey)
      if (env.github()) {
        if (output.d) {
          setSecret(output.d)
        }
        setOutput('json', output)
      } else {
        console.log(JSON.stringify(output, null, 2))
      }
      break
    }
    case 'keypub': {
      const verbose = values.verbose || false
      const [pathToPrivateKey] = positionals
      const privateKey = JSON.parse(fs.readFileSync(pathToPrivateKey).toString()) as jose.JWK
      if (env.github()) {
        if (privateKey.d) {
          setSecret(privateKey.d)
        }
      }
      const publicKey = toPublicKey(privateKey)
      if (verbose) {
        const message = `🔑 ${publicKey.kid}`
        debug(message)
      }
      const output = prettyKey(publicKey)
      if (env.github()) {
        if (output.d) {
          setSecret(output.d)
        }
        setOutput('json', output)
      } else {
        console.log(JSON.stringify(output, null, 2))
      }
      break
    }
    case 'sign': {
      const compact = values.compact || false
      const verbose = values.verbose || false
      const detached = values.detached || false
      const [pathToPrivateKey, pathToMessage] = positionals
      const privateKey = JSON.parse(fs.readFileSync(pathToPrivateKey).toString()) as jose.JWK
      if (env.github()) {
        if (privateKey.d) {
          setSecret(privateKey.d)
        }
      }
      const alg = privateKey.alg || values.alg
      if (!alg) {
        const message = `❌ --alg is required when not present in private key`
        console.error(message)
        throw new Error(message)
      }

      const header = { alg } as jose.ProtectedHeaderParameters

      if (detached) {
        header.b64 = false
        header.crit = ['b64']
      }

      const message = new Uint8Array(fs.readFileSync(pathToMessage))
      const jws = await new jose.FlattenedSign(
        message
      )
        .setProtectedHeader(header)
        .sign(await jose.importJWK(privateKey))

      if (verbose) {
        const message = `🔑 ${privateKey.kid}`
        debug(message)
      }

      if (env.github()) {
        if (compact) {
          setOutput('jws', `${jws.protected}.${jws.payload}.${jws.signature}`)
        } else {
          setOutput('json', jws)
        }
      } else {
        if (compact) {
          console.log(`${jws.protected}.${jws.payload}.${jws.signature}`)
        } else {
          console.log(JSON.stringify(jws, null, 2))
        }
      }
      break
    }
    case 'verify': {
      const compact = values.compact || false
      const verbose = values.verbose || false
      const detached = values.detached || false
      const [pathToPublicKey, pathToSignatures, pathToMessage] = positionals
      const publicKey = JSON.parse(fs.readFileSync(pathToPublicKey).toString()) as jose.JWK
      const alg = publicKey.alg || values.alg
      if (!alg) {
        const message = `❌ --alg is required when not present in public key`
        console.error(message)
        throw new Error(message)
      }
      let jws = fs.readFileSync(pathToSignatures).toString() as any
      if (compact) {
        const [protectedHeader, payload, signature] = jws.split('.')
        jws = {
          protected: protectedHeader,
          payload,
          signature
        }
      } else {
        jws = JSON.parse(jws)
      }
      if (detached) {
        jws.payload = new Uint8Array(fs.readFileSync(pathToMessage))
      }
      const { protectedHeader } = await jose.flattenedVerify(jws, await jose.importJWK(publicKey))
      if (verbose) {
        const message = `🔑 ${publicKey.kid}`
        debug(message)
      }
      const output = { protectedHeader }
      if (env.github()) {
        setOutput('json', output)
      } else {
        console.log(JSON.stringify(output, null, 2))
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