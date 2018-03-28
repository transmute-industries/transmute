export KONG_ADMIN_URL=$(minikube service gateway-kong-admin --url | sed 's,http://,https://,g')
export KONG_PROXY_URL=$(minikube service gateway-kong-proxy --url | sed 's,http://,https://,g')
export KONG_PROXY_PORT=$(kubectl get service gateway-kong-proxy -o json | jq -r '.spec.ports[0].nodePort')

echo 'SETTING UP IPFS'

# Get the service clusterIp for Kong to use.
export IPFS_CLUSTER_IP=$(kubectl get service mini-ipfs-ipfs -o json | jq -r '.spec.clusterIP');

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
  --data "config.methods=GET, PUT, POST"

# curl -k -X DELETE \
#   --url $KONG_ADMIN_URL/apis/ipfs 

echo 'IPFS HEALTHCHECK'
echo 'https://ipfs.transmute.minikube:'$KONG_PROXY_PORT

# Test IPFS via Kong

# curl -k -X GET \
#   --url 'https://ipfs.transmute.minikube:'$KONG_PROXY_PORT'/api/v0/id' 


# openssl req \
#     -newkey rsa:2048 \
#     -x509 \
#     -nodes \
#     -keyout ipfs.key \
#     -new \
#     -out ipfs.crt \
#     -subj /CN=ipfs.transmute.minikube \
#     -reqexts SAN \
#     -extensions SAN \
#     -config <(cat /System/Library/OpenSSL/openssl.cnf \
#         <(printf '[SAN]\nsubjectAltName=DNS:ipfs.transmute.minikube')) \
#     -sha256 \
#     -days 3650


# chrome://net-internals/#dns
# curl -k -X DELETE $KONG_ADMIN_URL/certificates/ipfs.transmute.minikube

# curl -k -i -X POST $KONG_ADMIN_URL/certificates \
#     -F "cert=@ipfs.crt" \
#     -F "key=@ipfs.key" \
#     -F "snis=ipfs.transmute.minikube"


# curl -k -i -X PATCH $KONG_ADMIN_URL/apis/ipfs \
#     -d "http_if_terminated=false"

# curl -k -i -X PATCH $KONG_ADMIN_URL/apis/ipfs \
#     -d "https_only=false"