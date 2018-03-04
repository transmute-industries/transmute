// https://emojipedia.org/unicode-8.0/
const shell = require('shelljs');

import { sleep } from './_tools';

describe('root', () => {
  it('helm can search ipfs', async () => {
    const command = `
helm search ipfs
`;

    const execution = shell.exec(command);

    if (execution.code !== 0) {
      shell.echo('🙍  Error failed to list helm charts');
      shell.exit(1);
    }
    
    console.log(execution.stdout);
  });

  // it('can get services', async () => {
  //   // if (shell.exec('helm install stable/ipfs').code !== 0) {
  //   //   shell.echo('🙍  Error failed to install IPFS with helm.');
  //   //   shell.exit(1);
  //   // }

  //   // await sleep(3);

  //   console.log('hello222');

  //   // setTimeout(() => {
  //   //   console.log('exiting tests after 10 seconds');
  //   //   process.exit(0);
  //   // }, 10 * 1000);

  //   // if (shell.exec('kubectl logs -f -n sonobuoy sonobuoy').code !== 0) {
  //   //   shell.echo('🙍  Error failed tail sonobuoy logs ');
  //   //   shell.exit(1);
  //   // }
  // });
});
