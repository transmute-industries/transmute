export KONG_ADMIN_URL=$(minikube service mini-kong-kong-admin --url | sed 's,http://,https://,g')
export KONG_PROXY_URL=$(minikube service mini-kong-kong-proxy --url | sed 's,http://,https://,g')
export KONG_PROXY_PORT=$(kubectl get service mini-kong-kong-proxy -o json | jq -r '.spec.ports[0].nodePort')

echo 'SETTING UP GANACHE'

# Get the service clusterIp for Kong to use.
export GANACHE_CLUSTER_IP=$(kubectl get service mini-ganache-ganache-cli -o json | jq -r '.spec.clusterIP');

# Add Ganache API to Kong
curl -k -X POST \
  --url $KONG_ADMIN_URL/apis/ \
  --data 'name=ganache' \
  --data 'hosts=ganache.transmute.minikube' \
  --data 'upstream_url=http://'$GANACHE_CLUSTER_IP':8545/'

echo 'GANACHE HEALTHCHECK'
echo 'https://ganache.transmute.minikube:'$KONG_PROXY_PORT

curl -k -X POST \
  --url 'https://ganache.transmute.minikube:'$KONG_PROXY_PORT \
  --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":68}'