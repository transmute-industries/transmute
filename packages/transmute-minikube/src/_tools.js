// https://emojipedia.org/unicode-8.0/

const shell = require('shelljs');
const _ = require('lodash');

export const sleep = seconds => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, seconds);
  });
};

const getOutputOrExitWithError = command => {
  // console.log(command)
  const execution = shell.exec(command, { silent: true });
  if (execution.code !== 0) {
    shell.echo('🙍  ' + execution.stdout);
    shell.echo('🙍  ' + execution.stderr);
    shell.exit(1);
  }
  return execution.stdout;
};

export const getIpfsInternalClusterIp = () => {
  const command = 'kubectl get services mini-ipfs-ipfs  ';
  // const output = `
  // NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
  // mini-ipfs-ipfs   ClusterIP   10.107.89.122   <none>        5001/TCP,8080/TCP   1h
  // `;
  const output = getOutputOrExitWithError(command);
  const ip_pattern = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
  let all_ips = _.words(output, ip_pattern);
  let clusterIp = all_ips[0];
  return clusterIp;
};

export const getKongApiEndpoint = () => {
  const command = 'echo $(minikube service --url mini-kong-kong-admin)';
  const output = getOutputOrExitWithError(command);
  return output.replace('http', 'https').trim();
};

export const getKongProxyEndpoint = () => {
  const command = 'echo $(minikube service --url mini-kong-kong-proxy)';
  const output = getOutputOrExitWithError(command);
  return output.replace('http', 'https').trim();
};

export const addIpfsGatewayToKong = (kongApi, ipfsIp) => {
  const command = `
curl -k -X POST \
--url ${kongApi}/apis/ \
--data 'name=example-api' \
--data 'hosts=example.com' \
--data 'upstream_url=http://${ipfsIp}:8080/'
`;
  const output = getOutputOrExitWithError(command);
  const kongResponse = JSON.parse(output);
  return kongResponse;
};

export const getIpfsReadmeFromKong = kongProxy => {
  const command = `
  curl -k -X GET \
  --url ${kongProxy}/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme \
  --header 'Host: example.com'
`;
  const output = getOutputOrExitWithError(command);
  return output;
};

export const deleteIpfsFromKong = kongApi => {
  const command = `
curl -k -X DELETE \
--url ${kongApi.trim()}/apis/example-api \
`;
  const output = getOutputOrExitWithError(command);
};
