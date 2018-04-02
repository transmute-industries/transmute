helm install stable/ipfs --name decentralized-storage

export IPFS_CLUSTER_IP=$(kubectl get service decentralized-storage-ipfs -o json | jq -r '.spec.clusterIP');

# Add IPFS API to Kong
curl -k -X POST \
  --url $KONG_ADMIN_URL/apis/ \
  --data 'name=ipfs' \
  --data 'uris=/' \
  --data 'strip_uri=true' \
  --data "https_only=true" \
  --data 'upstream_url=http://'$IPFS_CLUSTER_IP':5001/'  | jq

curl -k -X POST \
  --url $KONG_ADMIN_URL/apis/ipfs/plugins \
  --data "name=cors" \
  --data "config.origins=*" \
  --data "config.methods=GET, PUT, POST"

curl -k -X POST \
  --url $KONG_ADMIN_URL/apis/ipfs/plugins \
  --data "name=jwt"  \
  | jq

./scripts/okta/write-okta-pem.js

curl -k -X POST \
  --url $KONG_ADMIN_URL/consumers \
  --data "username="$KONG_CONSUMER_USERNAME \
  --data "custom_id="$KONG_CONSUMER_ID  | jq

curl -k -X POST \
  --url $KONG_ADMIN_URL/consumers/$KONG_CONSUMER_USERNAME/jwt \
  -F "algorithm=RS256" \
  -F "rsa_public_key=@"$OUTPUT_FILE \
  -F "key=https://"$OKTA_HOSTNAME"/oauth2/default"  | jq


export ACCESS_TOKEN=$(node ./scripts/okta/get-okta-token.js)

export KONG_NGROK_PROXY_URL=$(minikube service gateway-kong-proxy --url | sed 's,http://'$MINIKUBE_IP',https://'$KONG_NGROK_HOST',g')

sleep 3

curl -k -X GET \
  --url $KONG_NGROK_PROXY_URL/ipfs/api/v0/id \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  | jq


echo 'Enabling CORS for IPFS'

export POD_NAME=$(kubectl get pods --namespace default -l "app=ipfs,release=decentralized-storage"  -o jsonpath="{.items[0].metadata.name}")
kubectl exec -it $POD_NAME -- ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
kubectl exec -it $POD_NAME -- ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
# kubectl get pod $POD_NAME -o yaml | kubectl replace --force -f -


