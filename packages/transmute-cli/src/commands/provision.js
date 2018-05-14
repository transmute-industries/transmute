const run = require('./runner');
const aks = require('./aks');
const minikube = require('./minikube');

export function minikube_provision( clusterName ) {
  minikube.provision();
}

export function aks_ls( ) {
  aks.ls();
}

export function aks_register( ) {
  aks.register();
}

export function aks_provision( myResourceGroup, myAKSCluster, myNodeCount, GenSSHKeys ) {
  aks.provision( myResourceGroup, myAKSCluster, myNodeCount, GenSSHKeys );
}
