const run = require('./runner');

export function k8s( dryrun, clusterName ) {
  let prov_cmd = "$HOME/.transmute/git/transmute/scripts/initializer " + clusterName;
  console.log( prov_cmd );
  if (dryrun == true ) {
    console.log( 'dry run' );
  }
  else {
    run.ner( prov_cmd );
  }
}
