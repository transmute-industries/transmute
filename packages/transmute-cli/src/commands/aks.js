const shell = require('shelljs');

export function ls() {
  var ls_cmd = 'az aks list';
  //shell.exec(ls_cmd);
  console.log(ls_cmd);
}

export function register() {
  var reg_cmd = 'az provider register -n Microsoft.ContainerService';
  //shell.exec(reg_cmd);
  console.log(reg_cmd);
}

export function provision( myResourceGroup, myAKSCluster, myNodeCount, GenSSHKeys ) {
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
    var group_opt = '--resource-group ' + myResourceGroup;
  }
  var prov_cmd = 'az aks create '
    + group_opt
    + nodes_opt
    + akscluster_opt
    + gensshkeys_opt;
  //shell.exec(prov_cmd);
  console.log(prov_cmd);
}
