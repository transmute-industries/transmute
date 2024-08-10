import yargs from 'yargs'

import jose from './jose'

const init = () => {
  yargs.scriptName('✨')

  yargs.command(jose)

  yargs.help().alias('help', 'h').demandCommand().argv
}

const cli = { init }

export default cli
