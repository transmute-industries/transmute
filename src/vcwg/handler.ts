import fs from 'fs'
import * as jose from 'jose'
import { Arguments } from "../types"

import { setSecret, setOutput, debug } from '@actions/core'

import { env } from '../action'

export const handler = async function ({ positionals, values }: Arguments) {
  positionals = positionals.slice(1)
  const operation = positionals.shift()
  switch (operation) {
    case 'issue-credential': {
      const output = values.output
      const verbose = values.verbose || false
      const [pathToPrivateKey] = positionals
      const privateKey = JSON.parse(fs.readFileSync(pathToPrivateKey).toString()) as jose.JWK
      if (env.github()) {
        if (privateKey.d) {
          setSecret(privateKey.d)
        }
      }
      console.log('hey')
      // const publicKey = toPublicKey(privateKey)
      // if (verbose) {
      //   const message = `🔑 ${publicKey.kid}`
      //   debug(message)
      // }
      // if (output) {
      //   fs.writeFileSync(output, JSON.stringify(publicKey, null, 2))
      // }
      // if (env.github()) {
      //   setOutput('json', publicKey)
      // } else {
      //   console.log(JSON.stringify(publicKey, null, 2))
      // }
      break
    }

    default: {
      const message = `😕 Unknown Command`
      console.error(message)
      throw new Error(message)
    }
  }

}