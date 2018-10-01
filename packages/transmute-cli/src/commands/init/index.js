const run = require('../runner');

module.exports.k8s = (dryrun) => {
  let prov_cmd = 'ansible-playbook --diff -l "localhost" ' +
    __dirname +
    '/../../../components/ansible/init.yml';

  if (dryrun == 'true') {
    console.info('<--dry run-->');
    prov_cmd = prov_cmd + " --check";
  }
  run.shellExec(prov_cmd);
};
