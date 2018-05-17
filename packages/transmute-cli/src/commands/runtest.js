const run = require('./runner');

export function test() {
  let cmd2run =  'ls -lh $HOME/.transmute/git/transmute/setup/0.init.sh'
  run.ner( cmd2run );
  cmd2run = 'echo hello world!'
  run.ner( cmd2run );
}
