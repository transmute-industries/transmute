import yargs from 'yargs'
import key from './key'
import controller from './controller'
import credential from './credential'
import presentation from './presentation'
import graph from './graph'

import platform from './platform'

import cose from './cose'
import scitt from './scitt'

const init = () => {
  yargs.scriptName('✨')

  // jose
  key.register(yargs)

  // cose
  yargs.command(cose)

  // scitt
  yargs.command(scitt)

  // vcdm
  controller.register(yargs)
  credential.register(yargs)
  presentation.register(yargs)

  //platform
  yargs.command(platform)

  // neo4j
  graph.register(yargs)

  yargs.help().alias('help', 'h').demandCommand().argv
}

const cli = { init }

export default cli
