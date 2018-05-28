const run = require('./runner');

export function ls() {
  var ls_cmd = 'az aks list';
  console.log(ls_cmd);
  run.ner( ls_cmd );
}
