const run = require('./runner');

export function minikube( clusterName ) {
  prov_cmd = "$HOME/.transmute/git/transmute/scripts/initializer " + clusterName;
  run.ner( prov_cmd );
}

