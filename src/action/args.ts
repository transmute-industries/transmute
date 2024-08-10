
import { parseArgs } from "node:util";

import { getInput } from '@actions/core'

import { env } from "./env";

export type JoseOptions = {
  alg?: string
  enc?: string
  crv?: string
  compact?: boolean
}

export type CommonOptions = {
  output?: string
  verbose?: boolean
  detached?: boolean
}

export const args = (prompt: string) => {
  // https://stackoverflow.com/questions/29655760/convert-a-string-into-shell-arguments
  const re = /"[^"]+"|'[^']+'|\S+/g
  if (env.github() && !env.mock()) {
    prompt = getInput("transmute")
  }
  return parseArgs({
    allowPositionals: true,
    args: prompt.match(re) || [],
    options: {
      verbose: {
        type: 'boolean' as "boolean",
        short: 'v'
      },
      detached: {
        type: 'boolean' as "boolean",
        short: 'd'
      },
      compact: {
        type: 'boolean' as "boolean",
        short: 'c'
      },
      output: {
        type: 'string' as "string",
        short: 'o'
      },
      alg: {
        type: 'string' as "string",
      },
      enc: {
        type: 'string' as "string",
      },
      crv: {
        type: 'string' as "string",
      },
    },
  })
}