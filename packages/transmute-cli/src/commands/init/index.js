const run = require('../runner');

const path = require('path');

module.exports.k8s = (dryrun, clusterName) => {
  let prov_cmd = path.join(
    __dirname,
    './initializer ' + clusterName
  );

  if (dryrun == 'true') {
    console.info('<--dry run-->');
  } else {
    run.shellExec(prov_cmd);
  }
};
