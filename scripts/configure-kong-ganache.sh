#!/usr/bin/env bash
set -e
export KONG_ADMIN_URL=$(minikube service gateway-kong-admin --url | sed 's,http://,https://,g')
export KONG_PROXY_URL=$(minikube service gateway-kong-proxy --url | sed 's,http://,https://,g')
export KONG_PROXY_PORT=$(kubectl get service gateway-kong-proxy -o json | jq -r '.spec.ports[0].nodePort')
export KONG_HOST=$(echo $KONG_ADMIN_URL | sed 's!https://!!g' | cut -f1 -d:)
export KONG_PORT=$(echo $KONG_ADMIN_URL | sed 's!https://!!g' | cut -f2 -d:)

echo 'SETTING UP GANACHE'

# Get the service clusterIp for Kong to use.
export GANACHE_CLUSTER_IP=$(kubectl get service ganache-ganache-cli -o json | jq -r '.spec.clusterIP');
echo "GANACHE_CLUSTER_IP $GANACHE_CLUSTER_IP"

countzero=0
echo "Waiting for ganache to launch on $KONG_ADMIN_URL..."
while ! nc -z $KONG_HOST $KONG_PORT; do
    if [[ "$countzero" -gt 200 ]]; then
      echo 'timeout'
      exit 1
    fi
    ((++countzero))
    sleep 1
done
echo "ganache launched"

echo "# Add Ganache API to Kong
curl -k -X POST \
  --url $KONG_ADMIN_URL/apis/ \
  --data 'name=ganache' \
  --data 'hosts=ganache.transmute.minikube' \
  --data 'upstream_url=http://'$GANACHE_CLUSTER_IP':8545/'"
# Add Ganache API to Kong
curl -k -X POST \
  --url $KONG_ADMIN_URL/apis/ \
  --data 'name=ganache' \
  --data 'hosts=ganache.transmute.minikube' \
  --data 'upstream_url=http://'$GANACHE_CLUSTER_IP':8545/'

echo 'GANACHE HEALTHCHECK'
echo "https://ganache.transmute.minikube:$KONG_PROXY_PORT"

curl -k -X POST \
  --url "https://ganache.transmute.minikube:$KONG_PROXY_PORT/ganache" \
  --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":68}'
