import * as core from '@actions/core'

import { parseArgs } from "node:util";

// https://stackoverflow.com/questions/29655760/convert-a-string-into-shell-arguments
const re = /"[^"]+"|'[^']+'|\S+/g

// prefer to parse options deeper 
const options = {
  foo: {
    type: 'boolean' as "string" | "boolean",
    short: 'f',
  },
  alg: {
    type: 'string' as "string" | "boolean",
  },
};

export async function facade(prompt: string = process.argv.slice(2).join(' ')) {
  try {
    if (process.env.GITHUB_ACTION) {
      prompt = core.getInput("transmute")
    }
    const promptArgs = prompt.match(re) || []
    const parsed = parseArgs({ args: promptArgs, options, allowPositionals: true });
    console.log(parsed)
  } catch (error) {
    core.setFailed('💀 Internal Error.')
  }
}
