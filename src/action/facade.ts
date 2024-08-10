
import { parseArgs } from "node:util";

import * as core from '@actions/core'

const getArgs = (prompt: string) => {
  // https://stackoverflow.com/questions/29655760/convert-a-string-into-shell-arguments
  const re = /"[^"]+"|'[^']+'|\S+/g
  if (process.env.GITHUB_ACTION) {
    prompt = core.getInput("transmute")
  }
  return parseArgs({
    allowPositionals: true,
    args: prompt.match(re) || [],
    options: {
      alg: {
        type: 'string' as "string",
      },
    },
  })
}

export async function facade(prompt: string = process.argv.slice(2).join(' ')) {
  try {
    const parsed = getArgs(prompt)
    console.log(parsed)
  } catch (error) {
    // swallow error to prevent leaking
    const message = '💀 Internal Error.'
    if (process.env.GITHUB_ACTION) {
      core.setFailed(message)
    } else {
      console.error(message)
    }
  }
}
