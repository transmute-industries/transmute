const shell = require('shelljs');

export function ls() {
  var ls_cmd = 'ls';
  shell.echo(ls_cmd);
  shell.exec(ls_cmd);
}

export function find() {
  var find_cmd = 'find';
  shell.echo(find_cmd);
  shell.exec(find_cmd);
}

