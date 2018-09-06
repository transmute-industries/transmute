const shell = require('shelljs');
const run = require('../runner');

module.exports.k8s = (dryrun, clusterName) => {
  let check_sudo = shell.exec('sudo -n true >/dev/null 2>&1');
  let ansible_ask_passwd = check_sudo.code === 0 ? '' : '-K ';

  let prov_cmd = 'ansible-playbook --diff -l "localhost" ' +
    ansible_ask_passwd +
    __dirname +
    '/../../../components/ansible/init.yml -e ' + clusterName;

  if (dryrun == 'true') {
    console.info('<--dry run-->');
    prov_cmd = prov_cmd + " --check";
  }
  run.shellExec(prov_cmd);
};
