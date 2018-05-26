const run = require('./runner');

export function k8s( clusterName ) {
  let prov_cmd = "$HOME/.transmute/git/transmute/scripts/initializer " + clusterName;
  run.ner( prov_cmd );
}
