import yargs from 'yargs'
import key from './key'
import controller from './controller'
import credential from './credential'
import presentation from './presentation'
import graph from './graph'

const init = () => {
  yargs.scriptName('✨')

  // jose
  key.register(yargs)

  // vcdm
  controller.register(yargs)
  credential.register(yargs)
  presentation.register(yargs)

  // neo4j
  graph.register(yargs)
  
  yargs.help().alias('help', 'h').demandCommand().argv
}

const cli = { init }

export default cli
