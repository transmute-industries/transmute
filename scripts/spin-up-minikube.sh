#!/bin/bash
PATH=$HOME/.transmute/bin:$PATH
TRANSMUTE_ENV=minikube
set -e

export MINIKUBE_IP=$(minikube ip)
export KONG_ADMIN_URL=$(PATH=$HOME/.transmute/bin:$PATH minikube service gateway-kong-admin --url | sed 's,http://,https://,g')
export KONG_PROXY_URL=$(PATH=$HOME/.transmute/bin:$PATH minikube service gateway-kong-proxy --url | sed 's,http://,https://,g')
export KONG_PROXY_PORT=$(PATH=$HOME/.transmute/bin:$PATH kubectl get service gateway-kong-proxy -o json | jq -r '.spec.ports[0].nodePort')

./scripts/configure-hosts.sh
./scripts/configure-kong-ganache.sh
./scripts/configure-kong-ipfs.sh
./scripts/configure-kong-okta-ipfs.sh
./scripts/configure-framework-kong.sh

lerna bootstrap
lerna run --scope transmute-eventstore truffle:migrate
lerna run --scope ipfs-api build
ACCESS_TOKEN=$(node ./scripts/okta/get-okta-token.js) lerna run --scope transmute-eventstore test
lerna run --scope transmute-eventstore test:report
lerna run --scope transmute-eventstore build
# lerna run --scope transmute-eventstore test:smoke
lerna run --scope transmute-eventstore truffle:test
lerna run --scope transmute-eventstore truffle:coverage
lerna run --scope transmute-eventstore truffle:coverage:report