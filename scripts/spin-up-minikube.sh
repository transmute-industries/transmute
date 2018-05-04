#!/bin/sh
: ${DO_JWT_DL:=y}
PATH=$HOME/.transmute/bin:$PATH
TRANSMUTE_ENV=minikube
set -e
./w8s/generic.w8 ganache default

export MINIKUBE_IP=$(minikube ip)
export KONG_ADMIN_URL=$(PATH=$HOME/.transmute/bin:$PATH minikube service gateway-kong-admin --url | sed 's,http://,https://,g')
export KONG_PROXY_URL=$(PATH=$HOME/.transmute/bin:$PATH minikube service gateway-kong-proxy --url | sed 's,http://,https://,g')
export KONG_PROXY_PORT=$(PATH=$HOME/.transmute/bin:$PATH kubectl get service gateway-kong-proxy -o json | jq -r '.spec.ports[0].nodePort')

echo 'configure hosts'
./scripts/configure-hosts.sh
echo 'configure ganache'
./scripts/configure-kong-ganache.sh
echo 'configure ipfs'
./scripts/configure-kong-ipfs.sh
if [[ "$DO_JWT_DL" == 'y' ]]; then
  echo 'configure okta'
  ./scripts/configure-kong-okta-ipfs.sh
fi
echo 'configure framework'
./scripts/configure-framework-kong.sh

lerna bootstrap
lerna run --scope transmute-framework truffle:test
lerna run --scope transmute-framework truffle:coverage
lerna run --scope transmute-framework truffle:coverage:report

lerna run --scope transmute-framework truffle:migrate
lerna run --scope transmute-framework test
lerna run --scope transmute-framework test:report


