const run = require('../runner');
const APPS_NAMES = ['kong', 'ipfs', 'ganache'];

module.exports =  function install(dryrun, appname) {
  if (
    appname == undefined ||
    APPS_NAMES.indexOf(appname) == -1
  ) {
    logger.log({
      level: 'error',
      message: `Required set <appname>, valid <appname> is one of: `+ APPS_NAMES.toString(),
    });
  }
  let deploy_cmd =
    'ansible-playbook --diff -l "localhost" ' +
    __dirname +
    '/../../../components/ansible/provision-' + appname + '.yml';
  if (dryrun === 'true') {
    console.info('<--dry run-->');
    deploy_cmd = deploy_cmd + ' --check';
  }
  run.shellExec( deploy_cmd );
}
