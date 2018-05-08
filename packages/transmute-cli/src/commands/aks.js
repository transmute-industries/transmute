const shell = require('shelljs');

export function help() {
  shell.exec('az aks --help');
}

export function ls() {
  var ls_cmd = 'az aks list';
  shell.exec(ls_cmd);
}

export function register() {
  var reg_cmd = 'az provider register -n Microsoft.ContainerService';
  shell.exec(reg_cmd);
}

export function provision() {
  var prov_cmd = 'az aks create --resource-group myResourceGroup --name myAKSCluster --node-count 1 --generate-ssh-keys';
  shell.exec(prov_cmd);
}
