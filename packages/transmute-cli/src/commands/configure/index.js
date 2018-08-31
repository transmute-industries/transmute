const run = require('../runner');

module.exports.minikube_hosts = (dryrun) => {
  if (dryrun === 'true') {
    console.info('<--dry run-->');
    run.shellExec('echo $(minikube ip)  transmute.minikube');
    run.shellExec('echo $(minikube ip)  ipfs.transmute.minikube');
    run.shellExec('echo $(minikube ip)  ganache.transmute.minikube');
  } else {
    run.shellExec('echo "" | sudo tee -a /etc/hosts');
    run.shellExec('echo "$(minikube ip)  transmute.minikube" | sudo tee -a /etc/hosts');
    run.shellExec('echo "$(minikube ip)  ipfs.transmute.minikube" | sudo tee -a /etc/hosts');
    run.shellExec('echo "$(minikube ip)  ganache.transmute.minikube" | sudo tee -a /etc/hosts');
    run.shellExec('echo "" | sudo tee -a /etc/hosts');
  }
};
