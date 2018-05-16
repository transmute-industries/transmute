#!/bin/sh

export KONG_PROXY_URL=$(minikube service gateway-kong-proxy --url | sed 's,http://,https://,g')

# TODO: pull this out into its own script...

. ./setup/2.1.install_openebs.sh

helm install stable/ipfs --name decentralized-storage

export IPFS_CLUSTER_IP=$(kubectl get service decentralized-storage-ipfs -o json | jq -r '.spec.clusterIP');

# Add IPFS API to Kong
curl -k -X POST \
  --url $KONG_ADMIN_URL/apis/ \
  --data 'name=ipfs' \
  --data 'uris=/' \
  --data 'strip_uri=true' \
  --data "https_only=true" \
  --data 'upstream_url=http://'$IPFS_CLUSTER_IP':5001/'  | jq -r '.'

curl -k -X POST \
  --url $KONG_ADMIN_URL/apis/ipfs/plugins \
  --data "name=cors" \
  --data "config.origins=*" \
  --data "config.methods=GET, PUT, POST" | jq -r '.'

#curl -k -X POST \
  #--url $KONG_ADMIN_URL/apis/ipfs/plugins \
  #--data "name=jwt"  \
  #| jq -r '.'

#./scripts/okta/write-okta-pem.js

#curl -k -X POST \
  #--url $KONG_ADMIN_URL/consumers \
  #--data "username="$KONG_CONSUMER_USERNAME \
  #--data "custom_id="$KONG_CONSUMER_ID  | jq -r '.'

#curl -k -X POST \
  #--url $KONG_ADMIN_URL/consumers/$KONG_CONSUMER_USERNAME/jwt \
  #-F "algorithm=RS256" \
  #-F "rsa_public_key=@"$OUTPUT_FILE \
  #-F "key=https://"$OKTA_HOSTNAME"/oauth2/default"  | jq -r '.'


#export ACCESS_TOKEN=$(node ./scripts/okta/get-okta-token.js)

sleep 50

echo 'Enabling CORS for IPFS'

export POD_NAME=$(kubectl get pods --namespace default -l "app=ipfs,release=decentralized-storage"  -o jsonpath="{.items[0].metadata.name}")

ALLOW_ORIGIN_STAR="ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '[\"*\"]'"
ALLOW_ORIGIN_METHODS="ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '[\"PUT\", \"GET\", \"POST\"]'"

kubectl exec -it $POD_NAME /bin/bash -- -c "$ALLOW_ORIGIN_STAR"
kubectl exec -it $POD_NAME /bin/bash -- -c "$ALLOW_ORIGIN_METHODS"
kubectl delete pod $POD_NAME
