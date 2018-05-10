const shell = require('shelljs');

export function ls() {
  var ls_cmd = 'az aks list';
  shell.exec(ls_cmd);
  console.log(ls_cmd);
}

export function register() {
  shell.exec('az provider register -n Microsoft.Network');
  shell.exec('az provider register -n Microsoft.Storage');
  shell.exec('az provider register -n Microsoft.Compute');
  shell.exec('az provider register -n Microsoft.ContainerService');
  console.log('Registering Microsoft perms');
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
    var group_opt = ' --resource-group ' + myResourceGroup;
  }
  var prov_cmd = 'az aks create '
    + group_opt
    + nodes_opt
    + akscluster_opt
    + gensshkeys_opt;
  shell.exec(prov_cmd);
  console.log(prov_cmd);
  var prov_cmd = 'az aks get-credentials '
    + akscluster_opt
    + group_opt
  shell.exec(prov_cmd);
  console.log(prov_cmd);
  var init_cmd = "./scripts/initializer " + myAKSCluster;
  shell.exec(init_cmd);
}
