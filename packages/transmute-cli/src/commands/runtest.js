const run = require('./runner');

export function test() {
  let cmd2run = 'echo hello world!'
  run.ner( cmd2run );
}
