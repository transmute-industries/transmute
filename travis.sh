

cd packages/transmute-minikube
npm install
npm run test

echo "$(minikube ip)  transmute.minikube" | sudo tee -a /etc/hosts
echo "$(minikube ip)  ipfs.transmute.minikube" | sudo tee -a /etc/hosts
echo "$(minikube ip)  ganache.transmute.minikube" | sudo tee -a /etc/hosts

curl http://transmute.minikube:30000/

export GANACHE_CLUSTER_IP=$(kubectl get service mini-ganache-ganache-cli -o json | jq -r '.spec.clusterIP');

curl -k -X POST \
  --url https://transmute.minikube:32444/apis/ \
  --data 'name=ganache' \
  --data 'hosts=ganache.transmute.minikube' \
  --data 'upstream_url=http://'$GANACHE_CLUSTER_IP':8545/'

curl -k -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' https://ganache.transmute.minikube:32443/; echo

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
