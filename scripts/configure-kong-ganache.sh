
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

curl -k -X POST $KONG_PROXY_URL \
  --header 'Host: ganache.transmute.minikube' \
  --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}'

curl -k -X POST 'https://ganache.transmute.minikube:'$KONG_PROXY_PORT \
  --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}'