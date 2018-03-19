export KONG_ADMIN_URL=$(minikube service mini-kong-kong-admin --url | sed 's,http://,https://,g')
export KONG_PROXY_URL=$(minikube service mini-kong-kong-proxy --url | sed 's,http://,https://,g')
export KONG_PROXY_PORT=$(kubectl get service mini-kong-kong-proxy -o json | jq -r '.spec.ports[0].nodePort')

# Configure Kong to use Okta to secure IPFS

curl -k -X POST $KONG_ADMIN_URL/apis/ipfs/plugins \
    --data "name=jwt"

export CONSUMER_ID=$(curl -k -X POST $KONG_ADMIN_URL/consumers \
    --data "username=bob@example.com" \
    --data "custom_id=0" \
    | jq -r '.id')

# curl -k -X DELETE $KONG_ADMIN_URL/consumers/29f2ad8b-2696-4bf7-88a4-27f4b30376eb \

# Download JWT Signing Key
node ./scripts/okta/write-okta-pem.js

# Connect the API Consumer to okta
curl -k -X POST $KONG_ADMIN_URL/consumers/$CONSUMER_ID/jwt \
    -F "algorithm=RS256" \
    -F "rsa_public_key=@./scripts/okta/okta.pem" \
    -F "key=https://"$OKTA_HOSTNAME"/oauth2/default"

# Get an okta jwt
export ACCESS_TOKEN=$(node ./scripts/okta/get-okta-token.js)

curl -k -X GET \
    --url 'https://ipfs.transmute.minikube:'$KONG_PROXY_PORT/api/v0/id \
    --header 'Authorization: Bearer '$ACCESS_TOKEN