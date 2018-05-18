const run = require('./runner');

export function minikube( clusterName ) {
  let prov_cmd = "ls /root";
  run.ner( prov_cmd );
  prov_cmd = "$HOME/.transmute/git/transmute/scripts/initializer " + clusterName;
  run.ner( prov_cmd );
}

