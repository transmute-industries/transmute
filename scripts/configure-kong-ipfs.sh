export KONG_ADMIN_URL=$(minikube service mini-kong-kong-admin --url | sed 's,http://,https://,g')
export KONG_PROXY_URL=$(minikube service mini-kong-kong-proxy --url | sed 's,http://,https://,g')
export KONG_PROXY_PORT=$(kubectl get service mini-kong-kong-proxy -o json | jq -r '.spec.ports[0].nodePort')

echo 'SETTING UP IPFS'

# Get the service clusterIp for Kong to use.
export IPFS_CLUSTER_IP=$(kubectl get service mini-ipfs-ipfs -o json | jq -r '.spec.clusterIP');

# Add IPFS API to Kong
curl -k -X POST \
  --url $KONG_ADMIN_URL/apis/ \
  --data 'name=ipfs' \
  --data 'hosts=ipfs.transmute.minikube' \
  --data 'upstream_url=http://'$IPFS_CLUSTER_IP':5001/'

# Configure CORS for IPFS via Kong
curl -k -X POST \
  --url $KONG_ADMIN_URL/apis/ipfs/plugins \
  --data "name=cors" \
  --data "config.origins=*" \
  --data "config.methods=GET, PUT, POST"

echo 'IPFS HEALTHCHECK'
echo 'https://ipfs.transmute.minikube:'$KONG_PROXY_PORT

# Test IPFS via Kong

curl -k -X GET \
  --url 'https://ipfs.transmute.minikube:'$KONG_PROXY_PORT'/api/v0/id' 