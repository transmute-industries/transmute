import yargs from 'yargs'
import controller from './controller'
import graph from './graph'

const init = () => {
  yargs.scriptName('✨')
  controller.register(yargs)
  graph.register(yargs)
  yargs.help().alias('help', 'h').demandCommand().argv
}

const cli = { init }

export default cli
