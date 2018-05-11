#!/bin/bash
set -e
export KONG_ADMIN_URL=$(minikube service gateway-kong-admin --url | sed 's,http://,https://,g')
export KONG_PROXY_URL=$(minikube service gateway-kong-proxy --url | sed 's,http://,https://,g')
export KONG_PROXY_PORT=$(kubectl get service gateway-kong-proxy -o json | jq -r '.spec.ports[0].nodePort')

echo 'SETTING UP IPFS'

# Get the service clusterIp for Kong to use.
export IPFS_CLUSTER_IP=$(kubectl get service decentralized-storage-ipfs -o json | jq -r '.spec.clusterIP');

# Add IPFS API to Kong
curl -k -X POST \
  --url $KONG_ADMIN_URL/apis/ \
  --data 'name=ipfs' \
  --data 'hosts=ipfs.transmute.minikube' \
  --data "https_only=true" \
  --data 'upstream_url=http://'$IPFS_CLUSTER_IP':5001/'

# Configure CORS for IPFS via Kong
curl -k -X POST \
  --url $KONG_ADMIN_URL/apis/ipfs/plugins \
  --data "name=cors" \
  --data "config.origins=*" \
  --data "config.methods=GET, PUT, POST" \
  | jq

echo 'IPFS HEALTHCHECK'
echo 'https://ipfs.transmute.minikube:'$KONG_PROXY_PORT

curl -k -X GET \
  --url 'https://ipfs.transmute.minikube:'$KONG_PROXY_PORT'/api/v0/id' \
  | jq
