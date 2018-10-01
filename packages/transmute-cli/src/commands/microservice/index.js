const path = require('path');

const run = require('../runner');
const logger = require('../../logger');

const MICROSERVICE_NAMES = [
  'istio',
  'kong',
  'ipfs',
  'ganache',
  'elasticsearch',
];
const MICROSERVICE_VERSIONS = {
  istio: '1.0.2',
  kong: '',
  ipfs: '',
  ganache: '',
  elasticsearch: '',
};

module.exports.install = (dryrun, microservice, version) => {
  if (MICROSERVICE_NAMES.indexOf(microservice) === -1) {
    logger.log({
      level: 'error',
      message: `Error calling \`transmute k8s microservice install ${microservice}\``
        + '\nRequired argument: <microservice>'
        + '\nValid <microservice> is one of the following:\n\t'
        + `${MICROSERVICE_NAMES.toString().replace(/,/g, '\n\t')}`,
    });
    return;
  }

  const playbookPath = path.join(
    __dirname,
    `/../../../components/ansible/k8s-install-${microservice}.yml`,
  );

  let deployCommand = `ansible-playbook --diff ${playbookPath}`;

  const transmuteMicroserviceVersion = version || MICROSERVICE_VERSIONS[microservice];

  if (transmuteMicroserviceVersion) {
    deployCommand += ` -e transmute_${microservice}_version=${transmuteMicroserviceVersion}`;
  }

  if (dryrun === 'true') {
    deployCommand += ' --check';
  }

  run.shellExec(deployCommand);
};
