

cd packages/transmute-minikube
npm install
npm run test

echo "$(minikube ip) ipfs.transmute.minikube" | sudo tee -a /etc/hosts
echo "$(minikube ip) testrpc.transmute.minikube" | sudo tee -a /etc/hosts

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
