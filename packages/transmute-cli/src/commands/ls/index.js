const run = require('../runner');

module.exports =  function ls() {
  var ls_cmd = 'az aks list';
  run.shellExec( ls_cmd );
}
