const run = require('./runner');

module.exports =  function ls() {
  var ls_cmd = 'az aks list';
  run.ner( ls_cmd );
}
