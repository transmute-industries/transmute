const shell = require('shelljs');
const run = require('../runner');
const APPS_NAMES = ['kong', 'ipfs', 'ganache', 'elasticsearch'];

module.exports.install = (dryrun, appname) => {
  if (APPS_NAMES.indexOf(appname) == -1) {
    logger.log({
      level: 'error',
      message: `Required set <appname>, valid <appname> is one of: ` + APPS_NAMES.toString(),
    });
  } else {
    let check_sudo = shell.exec('sudo -n true >/dev/null 2>&1');
    let ansible_ask_passwd = check_sudo.code === 0 ? '' : '-K ';

    let deploy_cmd =
      'ansible-playbook --diff -l "localhost" ' +
      ansible_ask_passwd +
      __dirname +
      '/../../../components/ansible/k8s-install-' + appname + '.yml';

    if (dryrun === 'true') {
      console.info('<--dry run-->');
      deploy_cmd = deploy_cmd + ' --check';
    }
    run.shellExec(deploy_cmd);
  }
};
