const shell = require('shelljs');

export function status() {
  var status_cmd = 'minikube status';
  shell.exec(status_cmd);
  console.log(status_cmd);
}

export function provision( clusterName ) {
  var prov_cmd = 'minikube start ';
  shell.exec(prov_cmd);
  console.log(prov_cmd);
  var prov_cmd = "./commands/scripts/initializer " + clusterName;
  shell.exec(prov_cmd);
}

export function ls() {
  var prov_cmd = "pwd; ls"
  shell.exec(prov_cmd);
}
