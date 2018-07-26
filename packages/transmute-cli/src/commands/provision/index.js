const run = require('../runner');
const logger = require('../../logger');
const TRANSMUTE_KUBE_VERSION = process.env.TRANSMUTE_KUBE_VERSION || 'v1.9.0';
const MINIKUBE_CPU = process.env.MINIKUBE_CPU || '4';
const MINIKUBE_MEMORY = process.env.MINIKUBE_MEMORY || '4096';
const MINIKUBE_DISK = process.env.MINIKUBE_DISK || '100g';
const MINIKUBE_PROFILE = process.env.MINIKUBE_PROFILE || 'transmute-k8s';
const MINIKUBE_DRIVERS = ['virtualbox', 'kvm', 'kvm2', 'none']

module.exports.minikube = (dryrun, clusterName, minikubeDriver) => {
  let minikube_param =
    ' -e kubernetes_version=' +
    TRANSMUTE_KUBE_VERSION +
    ' -e minikube_disk_size=' +
    MINIKUBE_DISK +
    ' -e minikube_cpus=' +
    MINIKUBE_CPU +
    ' -e minikube_memory=' +
    MINIKUBE_MEMORY;
  +' -e minikube_profile=' + MINIKUBE_PROFILE;

  let prov_cmd = 'ansible-playbook -l --diff -vvv "localhost" ' + __dirname + '/../../../components/ansible/provision-minikube.yml'
  if (minikubeDriver != undefined || MINIKUBE_DRIVERS.indexOf(minikubeDriver) != -1) {
    prov_cmd = prov_cmd + ' -e minikube_vm_driver=' + minikubeDriver;
  }
  else if (minikubeDriver == 'none') {
    logger.log({
      level: 'info',
      message: `VMDriver=None requires minikube to run as root!`
    });
  }
  prov_cmd = prov_cmd + minikube_param;
  if (dryrun === 'true') {
    console.info('<--dry run-->');
  } else {
    run.shellExec(prov_cmd);
  }
};

module.exports.aks = (
  dryrun,
  myResourceGroup,
  myAKSCluster,
  myNodeCount,
  myNodeSize,
  GenSSHKeys
) => {
  run.shellExec('az provider register -n Microsoft.Network');
  run.shellExec('az provider register -n Microsoft.Storage');
  run.shellExec('az provider register -n Microsoft.Compute');
  run.shellExec('az provider register -n Microsoft.ContainerService');

  let gensshkeys_opt = ' ';
  if (GenSSHKeys) {
    gensshkeys_opt = ' --generate-ssh-keys';
  }
  if (myAKSCluster == undefined) {
    throw 'You need to define a clustername';
  } else {
    var akscluster_opt = ' --name ' + myAKSCluster;
  }
  if (myNodeCount == undefined) {
    throw 'You need to define a number of nodes';
  } else {
    var nodes_opt = ' --node-count ' + myNodeCount;
  }
  if (myNodeSize == undefined) {
    console.warn('no size given using default');
    var nodesize_opt = ' ';
  } else {
    var nodesize_opt = ' --node-vm-size ' + myNodeSize;
  }
  if (myResourceGroup == undefined) {
    throw 'You need to define a group';
  } else {
    var group_opt = ' --resource-group ' + myResourceGroup;
  }
  var prov_cmd =
    'az aks create ' +
    group_opt +
    nodes_opt +
    nodesize_opt +
    akscluster_opt +
    gensshkeys_opt;
  run.shellExec(prov_cmd);

  var prov_cmd = 'az aks get-credentials ' + akscluster_opt + group_opt;

  if (dryrun == 'true') {
    console.info('<--dry run-->');
  } else {
    run.shellExec(prov_cmd);
  }
};
