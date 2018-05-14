const run = require('./runner');

export function minikube( clusterName ) {
  let prov_cmd = "$HOME/.transmute/git/transmute/scripts/initializer " + clusterName;
  run.ner( prov_cmd );
  let cmd2run =  '/usr/bin/bash';
  let arg1 =  "-c";
  let arg2 =  "$HOME/.transmute/git/transmute/setup/0.init.sh";
  run.spawn( cmd2run, arg1, arg2 );
}

