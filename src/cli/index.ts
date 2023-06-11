import yargs from 'yargs'
import key from './key'
// import controller from './controller'
import credential from './credential'
import presentation from './presentation'
import graph from './graph'

const init = () => {
  yargs.scriptName('✨')
  key.register(yargs)
  credential.register(yargs)
  presentation.register(yargs)
  graph.register(yargs)
  yargs.help().alias('help', 'h').demandCommand().argv
}

const cli = { init }

export default cli
