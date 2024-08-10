import { setFailed } from '@actions/core'
import { args } from "./args"

import { handler } from './handler'

import { env } from './env'

export async function facade(prompt: string = process.argv.slice(2).join(' ')) {
  try {
    await handler(args(prompt))
  } catch (error) {
    // swallow error to prevent leaking
    const message = '💀 Internal Error.'
    if (env.github() && !env.mock()) {
      setFailed(message)
    } else {
      console.error(error)
    }
  }
}
