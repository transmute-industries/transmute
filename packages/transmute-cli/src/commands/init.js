const run = require('./runner');
const aks = require('./aks');
const minikube = require('./minikube');

export function minikube_init() {
  let cmd2run =  '/usr/bin/bash';
  let arg1 =  "-c";
  let arg2 =  "$HOME/.transmute/git/transmute/setup/0.init.sh";
  run.spawn( cmd2run, arg1, arg2 );
}
