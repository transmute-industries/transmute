
import { parseArgs } from "node:util";

import { getInput } from '@actions/core'

import { env } from "./env";

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
      alg: {
        type: 'string' as "string",
        short: 'a'
      },
    },
  })
}