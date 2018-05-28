const run = require('./runner');
const KUBE_VERSION = process.env.KUBE_VERSION ||  'v1.9.0';
const MINIKUBE_CPU = process.env.MINIKUBE_CPU ||  '4';
const MINIKUBE_MEMORY = process.env.MINIKUBE_MEMORY ||  '4096';
const MINIKUBE_DISK = process.env.MINIKUBE_DISK ||  '100g';
const MINIKUBE_PROFILE = process.env.MINIKUBE_PROFILE ||  'transmute-k8s';

export function minikube( clusterName, minikubeDriver ) {
  const minikube_start = 'minikube start '
    + ' --kubernetes-version ' +  KUBE_VERSION
    + ' --disk-size ' +  MINIKUBE_DISK
    + ' --cpus ' +  MINIKUBE_CPU
    + ' --memory ' +  MINIKUBE_MEMORY;
    + ' --profile ' +  MINIKUBE_PROFILE;
  let prov_cmd = minikube_start + ' --vm-driver=virtualbox';
  if (minikubeDriver == undefined ) {
    prov_cmd = minikube_start + ' --vm-driver=virtualbox';
  }
  else if (minikubeDriver == 'virtualbox' ) {
    prov_cmd = minikube_start + ' --vm-driver=virtualbox';
  }
  else if (minikubeDriver == 'kvm' ) {
    prov_cmd = minikube_start + ' --vm-driver=kvm';
  }
  else if (minikubeDriver == 'kvm2' ) {
    prov_cmd = minikube_start + ' --vm-driver=kvm2';
  }
  else if (minikubeDriver == 'none' ) {
    prov_cmd = minikube_start + ' --vm-driver=none';
  }
  else {
    prov_cmd = minikube_start + ' --vm-driver=virtualbox';
  }
  console.log( prov_cmd );
  run.ner( prov_cmd );
}

export function aks( myResourceGroup, myAKSCluster, myNodeCount, GenSSHKeys ) {
  run.ner('az provider register -n Microsoft.Network');
  run.ner('az provider register -n Microsoft.Storage');
  run.ner('az provider register -n Microsoft.Compute');
  run.ner('az provider register -n Microsoft.ContainerService');
  console.log('Registering Microsoft perms');

  let gensshkeys_opt = ' ';
  if (GenSSHKeys) {
    gensshkeys_opt = ' --generate-ssh-keys';
  }
  if (myAKSCluster == undefined ) {
    throw 'You need to define a clustername';
  }
  else {
    var akscluster_opt = ' --name ' + myAKSCluster;
  }
  if (myNodeCount == undefined ) {
    throw 'You need to define a number of nodes';
  }
  else {
    var nodes_opt = ' --node-count ' + myNodeCount;
  }
  if (myResourceGroup == undefined ) {
    throw 'You need to define a group';
  }
  else {
    var group_opt = ' --resource-group ' + myResourceGroup;
  }
  var prov_cmd = 'az aks create '
    + group_opt
    + nodes_opt
    + akscluster_opt
    + gensshkeys_opt;
  run.ner(prov_cmd);
  console.log(prov_cmd);
  var prov_cmd = 'az aks get-credentials '
    + akscluster_opt
    + group_opt
  run.ner(prov_cmd);
  console.log(prov_cmd);
}
