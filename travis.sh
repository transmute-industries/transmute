
export IPFS_CLUSTER_IP=$(kubectl get service mini-ipfs-ipfs -o json | jq -r '.spec.clusterIP');

curl -k -X POST \
  --url $KONG_ADMIN_URL/apis/ \
  --data 'name=ipfs' \
  --data 'hosts=ipfs.transmute.minikube' \
  --data 'upstream_url=http://'$IPFS_CLUSTER_IP':5001/'



curl -k $KONG_PROXY_URL/api/v0/id \
  --header 'Host: ipfs.transmute.minikube'

# curl -k $IPFS_GATEWAY/api/v0/id 

# export GANACHE_CLUSTER_IP=$(kubectl get service mini-ganache-ganache-cli -o json | jq -r '.spec.clusterIP');

# curl -k -X POST \
#   --url $KONG_PROXY_URL/apis/ \
#   --data 'name=ganache' \
#   --data 'hosts=ganache.transmute.minikube' \
#   --data 'upstream_url=http://'$GANACHE_CLUSTER_IP':8545/'

# curl -k -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' https://ganache.transmute.minikube:32443/; echo

# export GANACHE_CLI=$(minikube --namespace transmute-testrpc service transmute-testrpc-ganache-cli --url)

# lerna clean
# lerna bootrstrap
# lerna run cleanup
# lerna run contracts:migrate
# lerna run contracts:generate
# lerna bootstrap
# lerna run test --scope transmute-framework

# migrate -> generate -> test
# lerna bootstrap

# cd ./packages/transmute-contracts
# yarn cleanup
# yarn contracts:migrate
# cd ../../packages/transmute-framework
# yarn install
# lerna bootstrap
# yarn cleanup
# yarn contracts:generate
# lerna run test --scope transmute-ipfs
# yarn test
