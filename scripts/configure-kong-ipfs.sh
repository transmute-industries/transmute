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


curl -k -X POST $KONG_ADMIN_URL/apis/ipfs/plugins \
    --data "name=jwt"

export CONSUMER_ID=$(curl -k -X POST $KONG_ADMIN_URL/consumers \
    --data "username=bob@example.com" \
    --data "custom_id=0" \
    | jq -r '.id')

# curl -k -X DELETE $KONG_ADMIN_URL/consumers/29f2ad8b-2696-4bf7-88a4-27f4b30376eb \

# Download the Keyfile from okta

node ./scripts/okta/write-okta-pem.js

curl -k -X POST $KONG_ADMIN_URL/consumers/$CONSUMER_ID/jwt \
    -F "algorithm=RS256" \
    -F "rsa_public_key=@./scripts/okta/okta.pem" \
    -F "key=https://"$OKTA_HOSTNAME"/oauth2/default"

export ACCESS_TOKEN=$(node ./scripts/okta/get-okta-token.js)

curl -k -X GET \
    --url 'https://ipfs.transmute.minikube:'$KONG_PROXY_PORT/api/v0/id \
    --header 'Authorization: Bearer '$ACCESS_TOKEN