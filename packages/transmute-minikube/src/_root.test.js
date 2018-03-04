// https://emojipedia.org/unicode-8.0/
const shell = require('shelljs');

it('can get services', () => {
  
  // if (shell.exec('helm install stable/ipfs').code !== 0) {
  //   shell.echo('🙍  Error failed to install IPFS with helm.');
  //   shell.exit(1);
  // }

  // if (shell.exec('helm ls').code !== 0) {
  //   shell.echo('🙍  Error failed list helm charts');
  //   shell.exit(1);
  // }

  setTimeout(() => {
    console.log('exiting tests after 10 seconds');
    process.exit(0);
  }, 10 * 1000);

  if (shell.exec('kubectl logs -f -n sonobuoy sonobuoy').code !== 0) {
    shell.echo('🙍  Error failed tail sonobuoy logs ');
    shell.exit(1);
  }
});
