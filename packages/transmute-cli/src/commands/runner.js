const shell = require('shelljs');
const ps = require('child_process');

export function ner( command2run ) {
  shell.exec(command2run);
  console.log(command2run);
}

export function spawn( command2run ) {
  ps.execFileSync(command2run, {stdio: 'inherit'});
  console.log(command2run);
}
