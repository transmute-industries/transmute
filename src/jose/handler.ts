import * as jose from 'jose'

import { PositionalArguments } from "../types"

import { setSecret, setOutput, debug } from '@actions/core'

import { env } from '../action'

const prettyKey = (k: jose.JWK) => {
  const { kid, kty, crv, alg, x, y, d } = k
  return JSON.stringify({ kid, kty, crv, alg, x, y, d }, null, 2)
}

export const handler = async function ({ positionals, values }: PositionalArguments) {
  const [resource, _action] = positionals.slice(1)
  switch (resource) {
    case 'keygen': {
      const alg = values.alg || 'ES256'
      const crv = values.crv || 'Ed25519'
      const verbose = values.verbose || false
      const k = await jose.generateKeyPair(alg, { crv })
      const privateKey = await jose.exportJWK(k.privateKey)
      privateKey.kid = await jose.calculateJwkThumbprint(privateKey)
      if (verbose) {
        const message = `🔑 ${privateKey.kid}`
        debug(message)
      }
      const output = prettyKey(privateKey)
      if (env.github()) {
        setSecret(output)
        setOutput('json', output)
      } else {
        console.log(output)
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