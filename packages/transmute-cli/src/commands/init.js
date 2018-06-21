const run = require('./runner');

const path = require('path')

export function k8s( dryrun, clusterName ) {
  let prov_cmd = path.join(__dirname, "../../scripts/initializer");

  // console.log( prov_cmd );
  if (dryrun == 'true' ) {
    console.log( '<--dry run-->' );
  }
  else {
    run.ner( prov_cmd );
  }
}
