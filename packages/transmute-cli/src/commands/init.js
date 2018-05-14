const run = require('./runner');
const aks = require('./aks');

export function minikube() {
  let cmd2run =  '/usr/bin/bash';
  let arg1 =  "-c";
  let arg2 =  "$HOME/.transmute/git/transmute/setup/0.init.sh";
  run.spawn( cmd2run, arg1, arg2 );
}

