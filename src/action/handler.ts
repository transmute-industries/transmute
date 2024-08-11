import { Arguments } from '../types'

import * as jose from '../jose'
import * as cose from '../cose'
import * as scitt from '../scitt'
import * as vcwg from '../vcwg'

const commands = { jose, cose, scitt, vcwg }

export const handler = async (args: Arguments) => {
  const [command] = args.positionals
  if (commands[command]) {
    await commands[command].handler(args)
  } else {
    const message = `😕 Unknown Command`
    console.error(message)
    throw new Error(message)
  }
}