import * as jose from 'jose'

import { Arguments } from "../types"

import { setSecret, setOutput, debug } from '@actions/core'

import { env } from '../action'

const prettyKey = (k: jose.JWK) => {
  const { kid, kty, crv, alg, x, y, d } = k
  return { kid, kty, crv, alg, x, y, d }
}

export const handler = async function ({ positionals, values }: Arguments) {
  const [resource] = positionals.slice(1)
  switch (resource) {
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
    default: {
      const message = `😕 Unknown Command`
      console.error(message)
      throw new Error(message)
    }
  }

}