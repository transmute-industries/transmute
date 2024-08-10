
import { parseArgs } from "node:util";

import { getInput } from '@actions/core'

import { env } from "./env";

export type JoseOptions = {
  alg?: string
  crv?: string
  compact?: boolean
}

export type CommonOptions = {
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
      alg: {
        type: 'string' as "string",
        short: 'a'
      },
    },
  })
}