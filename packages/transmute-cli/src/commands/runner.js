const shell = require('shelljs');
const ps = require('child_process');

export function ner( command2run ) {
  shell.exec(command2run);
  console.log(command2run);
}

export function spawn( command2run, this_arg1, this_arg2 ) {
  ps.execFileSync(command2run, [ this_arg1, this_arg2 ] , {stdio: 'inherit'});
  console.log(command2run, this_arg1, this_arg2);
}
