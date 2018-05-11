const run = require('./runner');


export function test() {
  let cmd2run = 'pwd; ls'
  run.ner( cmd2run );
  cmd2run = './scripts/hello'
  run.ner( cmd2run );
}
