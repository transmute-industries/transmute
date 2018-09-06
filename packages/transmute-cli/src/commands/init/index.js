const run = require('../runner');

const path = require('path');

module.exports.k8s = (dryrun, clusterName) => {
  let prov_cmd = 'ansible-playbook --diff -l "localhost" -K ' +
    __dirname +
    '/../../../components/ansible/init.yml -e ' + clusterName;

  if (dryrun == 'true') {
    console.info('<--dry run-->');
    prov_cmd = prov_cmd + " --check";
  }
  run.shellExec(prov_cmd);
};
