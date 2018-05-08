const shell = require('shelljs');

export function help() {
  shell.exec('az aks --help');
}

export function ls() {
  var ls_cmd = 'az aks list';
  shell.exec(ls_cmd);
}
