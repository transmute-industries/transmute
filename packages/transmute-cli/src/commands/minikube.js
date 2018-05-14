const run = require('./runner');

export function init() {
  let cmd2run =  '/usr/bin/bash';
  let arg1 =  "-c";
  let arg2 =  "$HOME/.transmute/git/transmute/setup/0.init.sh";
  run.spawn( cmd2run, arg1, arg2 );
}

export function provision( clusterName ) {
  var prov_cmd = 'minikube start ';
  run.ner( prov_cmd );
  console.log(prov_cmd);
  var prov_cmd = "./scripts/initializer " + clusterName;
  run.ner( prov_cmd );
}
