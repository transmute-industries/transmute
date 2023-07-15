import yargs from 'yargs'
import key from './key'
import controller from './controller'
import credential from './credential'
import presentation from './presentation'
import graph from './graph'

import platform from './platform'

import cose from './cose'
import scitt from './scitt'

import w3c from './w3c'
import dl from './digital-link'

const init = () => {
  yargs.scriptName('✨')

  // jose
  key.register(yargs)

  // cose
  yargs.command(cose)

  // scitt
  yargs.command(scitt)

  // w3c
  yargs.command(w3c)

  // digital-link
  yargs.command(dl)

  // vcdm
  controller.register(yargs)
  credential.register(yargs)
  presentation.register(yargs)

  // neo4j
  graph.register(yargs)

  // platform
  yargs.command(platform)

  yargs.help().alias('help', 'h').demandCommand().argv
}

const cli = { init }

export default cli
