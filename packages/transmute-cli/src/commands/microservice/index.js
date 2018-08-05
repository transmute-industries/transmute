const run = require('../runner');
const APPS_NAMES = ['kong', 'ipfs', 'ganache'];

module.exports.install = (dryrun, appname) => {
  if (APPS_NAMES.indexOf(appname) == -1) {
    logger.log({
      level: 'error',
      message: `Required set <appname>, valid <appname> is one of: ` + APPS_NAMES.toString(),
    });
  } else {
    let deploy_cmd =
      'ansible-playbook --diff -l "localhost" ' +
      __dirname +
      '/../../../components/ansible/k8s-install-' + appname + '.yml';

    if (dryrun === 'true') {
      console.info('<--dry run-->');
      deploy_cmd = deploy_cmd + ' --check';
    }
    run.shellExec(deploy_cmd);
  }
};
