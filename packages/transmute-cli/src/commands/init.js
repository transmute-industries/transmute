const run = require('./runner');

export function minikube( clusterName ) {
  let prov_cmd = "$HOME/.transmute/git/transmute/scripts/initializer " + clusterName;
  run.ner( prov_cmd );
}
