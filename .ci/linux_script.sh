#!/bin/sh
export PATH=$HOME/.transmute/bin:$PATH

sudo chown travis /usr/bin
sudo chown travis /usr/local/bin
minikube start --vm-driver=none --kubernetes-version=v1.9.4
minikube update-context
JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}'; until kubectl get nodes -o jsonpath="$JSONPATH" 2>&1 | grep -q "Ready=True"; do sleep 1; done

curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get | bash
helm init --force-upgrade --tiller-image powerhome/tiller:git-3b22ecd

node -v
npm -v

npm install -g codecov lerna@2.9.0 truffle@4.1.3

lerna -v
truffle version

sleep 60
kubectl cluster-info
nsenter --version
minikube addons enable ingress

helm install stable/kong --name gateway
helm install stable/ipfs --name decentralized-storage
helm install ./charts/ganache-cli --name=ganache
sleep 180

kubectl get services

export MINIKUBE_IP=$(minikube ip)
export KONG_ADMIN_URL=$(minikube service gateway-kong-admin --url | sed 's,http://,https://,g')
export KONG_PROXY_URL=$(minikube service gateway-kong-proxy --url | sed 's,http://,https://,g')
export KONG_PROXY_PORT=$(kubectl get service gateway-kong-proxy -o json | jq -r '.spec.ports[0].nodePort')

npm install
./scripts/configure-hosts.sh
./scripts/configure-kong-ganache.sh
./scripts/configure-kong-ipfs.sh
# ./scripts/configure-kong-okta-ipfs.sh
./scripts/configure-framework-kong.sh 

lerna bootstrap

TRANSMUTE_ENV=minikube lerna run --scope transmute-eventstore truffle:migrate
# TRANSMUTE_ENV=minikube lerna run --scope ipfs-api build
TRANSMUTE_ENV=minikube ACCESS_TOKEN=$(node ./scripts/okta/get-okta-token.js) lerna run --scope transmute-eventstore test
TRANSMUTE_ENV=minikube lerna run --scope transmute-eventstore test:report
TRANSMUTE_ENV=minikube lerna run --scope transmute-eventstore build
# TRANSMUTE_ENV=minikube lerna run --scope transmute-eventstore test:smoke 

TRANSMUTE_ENV=minikube lerna run --scope transmute-eventstore truffle:test

lerna run --scope transmute-eventstore truffle:coverage
lerna run --scope transmute-eventstore truffle:coverage:report
