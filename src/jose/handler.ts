import fs from 'fs'
import * as jose from 'jose'
import { Arguments } from "../types"

import { setSecret, setOutput, debug } from '@actions/core'

import { env } from '../action'

export const prettyKey = (k: jose.JWK) => {
  const { kid, kty, crv, alg, x, y, d } = k
  return { kid, kty, crv, alg, x, y, d }
}

export const toPublicKey = (k: jose.JWK) => {
  const { kid, kty, crv, alg, x, y, } = k
  return { kid, kty, crv, alg, x, y, }
}

const flatSigner = ({ privateKeyJwk }: any) => {
  return {
    sign: async (header: any, payload: any) => {
      const jws = await new jose.FlattenedSign(
        payload
      )
        .setProtectedHeader(header)
        .sign(await jose.importJWK(privateKeyJwk))
      return jws
    }
  }
}

export const handler = async function ({ positionals, values }: Arguments) {
  positionals = positionals.slice(1)
  const operation = positionals.shift()
  switch (operation) {
    case 'keygen': {
      const output = values.output
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
      if (output) {
        fs.writeFileSync(output, JSON.stringify(prettyKey(privateKey), null, 2))
      }
      if (env.github()) {
        if (privateKey.d) {
          setSecret(privateKey.d)
        }
        setOutput('json', prettyKey(privateKey))
      } else {
        if (!output) {
          console.log(JSON.stringify(prettyKey(privateKey), null, 2))
        }
      }
      break
    }
    case 'keypub': {
      const output = values.output
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
      if (output) {
        fs.writeFileSync(output, JSON.stringify(publicKey, null, 2))
      }
      if (env.github()) {
        setOutput('json', publicKey)
      } else {
        if (!output) {
          console.log(JSON.stringify(publicKey, null, 2))
        }
      }
      break
    }
    case 'sign': {
      const output = values.output
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
      const signer = flatSigner({ privateKeyJwk: privateKey })
      const jws = await signer.sign(header, message)

      if (verbose) {
        const message = `🔑 ${privateKey.kid}`
        debug(message)
      }

      if (output) {
        if (compact) {
          fs.writeFileSync(output, `${jws.protected}.${jws.payload}.${jws.signature}`)
        } else {
          fs.writeFileSync(output, JSON.stringify(jws, null, 2))
        }
      }

      if (env.github()) {
        if (compact) {
          setOutput('jws', `${jws.protected}.${jws.payload}.${jws.signature}`)
        } else {
          setOutput('json', jws)
        }
      } else {
        if (!output) {
          if (compact) {
            console.log(`${jws.protected}.${jws.payload}.${jws.signature}`)
          } else {
            console.log(JSON.stringify(jws, null, 2))
          }
        }

      }
      break
    }
    case 'verify': {
      const output = values.output
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
      const { payload, protectedHeader } = await jose.flattenedVerify(jws, await jose.importJWK(publicKey))
      if (verbose) {
        const message = `🔑 ${publicKey.kid}`
        debug(message)
      }
      if (output) {
        fs.writeFileSync(output, payload)
      }
      if (env.github()) {
        setOutput('json', protectedHeader)
      } else {
        if (!output) {
          console.log(JSON.stringify(protectedHeader, null, 2))
        }
      }
      break
    }
    case 'encrypt': {
      const output = values.output
      const compact = values.compact || false
      const enc = values.enc || false
      const verbose = values.verbose || false
      const [pathToPublicKey, pathToMessage] = positionals
      const publicKey = JSON.parse(fs.readFileSync(pathToPublicKey).toString()) as jose.JWK
      const alg = publicKey.alg || values.alg
      if (!enc) {
        const message = `❌ --enc is required.`
        console.error(message)
        throw new Error(message)
      }
      if (!alg) {
        const message = `❌ --alg is required when not present in public key`
        console.error(message)
        throw new Error(message)
      }
      const message = new Uint8Array(fs.readFileSync(pathToMessage))
      const header = { alg } as jose.ProtectedHeaderParameters

      let jwe;

      if (compact) {
        jwe = await new jose.CompactEncrypt(
          message
        )
          .setProtectedHeader({ enc, alg: `${publicKey.alg}` })
          .encrypt(await jose.importJWK(publicKey))

      } else {
        jwe = await new jose.GeneralEncrypt(
          message
        )
          .setProtectedHeader({ enc })
          .addRecipient(await jose.importJWK(publicKey))
          .setUnprotectedHeader(header)
          .encrypt()
      }

      if (verbose) {
        const message = `🔑 ${publicKey.kid}`
        debug(message)
      }
      if (env.github()) {
        if (compact) {
          setOutput('jwe', jwe)
        } else {
          setOutput('json', jwe)
        }
      } else {
        if (!output) {
          if (compact) {
            console.log(jwe)
          } else {
            console.log(JSON.stringify(jwe, null, 2))
          }
        }
      }
      break
    }
    case 'decrypt': {
      const output = values.output
      const compact = values.compact || false
      const verbose = values.verbose || false
      const [pathToPrivateKey, pathToMessage] = positionals
      const privateKey = JSON.parse(fs.readFileSync(pathToPrivateKey).toString()) as jose.JWK
      if (env.github()) {
        if (privateKey.d) {
          setSecret(privateKey.d)
        }
      }

      let jwe = fs.readFileSync(pathToMessage).toString() as any

      let result;
      if (compact) {
        result = await jose.compactDecrypt(
          jwe, await jose.importJWK(privateKey)
        )
      } else {
        jwe = JSON.parse(jwe)
        result = await jose.generalDecrypt(
          jwe, await jose.importJWK(privateKey)
        )
      }

      const { plaintext, protectedHeader } = result

      if (verbose) {
        const message = `🔑 ${privateKey.kid}`
        debug(message)
      }

      if (output) {
        fs.writeFileSync(output, plaintext)
      }

      if (env.github()) {
        setOutput('json', protectedHeader)
      } else {
        if (!output) {
          console.log(JSON.stringify(protectedHeader, null, 2))
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