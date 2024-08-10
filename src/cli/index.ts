import yargs from 'yargs'
import key from './key'

import graph from './graph'

import platform from './platform'

import cose from './cose'
import scitt from './scitt'

import dl from './digital-link'

const init = () => {
  yargs.scriptName('✨')

  // jose
  key.register(yargs)

  // cose
  yargs.command(cose)

  // scitt
  yargs.command(scitt)

  // digital-link
  yargs.command(dl)

  // neo4j
  graph.register(yargs)

  // platform
  yargs.command(platform)

  yargs.help().alias('help', 'h').demandCommand().argv
}

const cli = { init }

export default cli
