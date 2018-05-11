const run = require('./runner');

export function minikube() {
  let cmd2run = './setup/0.init.sh'
  run.spawn( cmd2run );
}
