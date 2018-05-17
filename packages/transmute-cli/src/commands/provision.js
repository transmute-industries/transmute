const run = require('./runner');

export function minikube( clusterName, minikubeDriver ) {
  let prov_cmd = 'minikube start --vm-driver=vbox';
  if (minikubeDriver == undefined ) {
    prov_cmd = 'minikube start --vm-driver=vbox';
  }
  else if (minikubeDriver == 'vbox' ) {
    prov_cmd = 'minikube start --vm-driver=vbox';
  }
  else if (minikubeDriver == 'kvm' ) {
    prov_cmd = 'minikube start --vm-driver=kvm';
  }
  else if (minikubeDriver == 'kvm2' ) {
    prov_cmd = 'minikube start --vm-driver=kvm2';
  }
  else if (minikubeDriver == 'none' ) {
    prov_cmd = 'minikube start --vm-driver=none';
  }
  else {
    prov_cmd = 'minikube start --vm-driver=vbox';
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

  if (GenSSHKeys) {
    var gensshkeys_opt = ' --generate-ssh-keys';
  }
  else {
    var gensshkeys_opt = ' ';
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
