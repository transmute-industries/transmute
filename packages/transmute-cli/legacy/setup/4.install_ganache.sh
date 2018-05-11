#!/bin/sh
helm install ./components/ganache/charts/ganache-cli/ --name ganache

export KONG_ADMIN_URL=$(minikube service gateway-kong-admin --url | sed 's,http://,https://,g')
export GANACHE_CLUSTER_IP=$(kubectl get service ganache-ganache-cli -o json | jq -r '.spec.clusterIP');
export KONG_NGROK_PROXY_URL=$(minikube service gateway-kong-proxy --url | sed 's,http://'$MINIKUBE_IP',https://'$KONG_NGROK_HOST',g')
export KONG_PROXY_PORT=$(kubectl get service gateway-kong-proxy -o json | jq -r '.spec.ports[0].nodePort')

curl -k -X POST \
  --url $KONG_ADMIN_URL/apis/ \
  --data 'name=ganache' \
  --data 'uris=/ganache' \
  --data 'upstream_url=http://'$GANACHE_CLUSTER_IP':8545/' | jq

echo "Waiting for Ganache..."
sleep 45
echo "Ganache ready"

curl -k -X POST \
  --url $KONG_NGROK_PROXY_URL/ganache \
  --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":68}' | jq

echo -e $"\n\n\n\nKONG_NGROK_PROXY_URL: "$KONG_NGROK_PROXY_URL
echo -e $"KONG_NGROK_HOST: "$KONG_NGROK_HOST
echo -e $"KONG_PROXY_PORT: "$KONG_PROXY_PORT
