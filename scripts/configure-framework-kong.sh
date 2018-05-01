#!/bin/bash
set -e
export KONG_ADMIN_URL=$(minikube service gateway-kong-admin --url | sed 's,http://,https://,g')
export KONG_PROXY_URL=$(minikube service gateway-kong-proxy --url | sed 's,http://,https://,g')
export KONG_PROXY_PORT=$(kubectl get service gateway-kong-proxy -o json | jq -r '.spec.ports[0].nodePort')

# TESTING

# export OLD_KONG_PROXY_PORT=32443
# export NEW_KONG_PROXY_PORT=11111

# export OLD_KONG_PROXY_PORT=11111
# export NEW_KONG_PROXY_PORT=32443

# REAL
export OLD_KONG_PROXY_PORT=32443
export NEW_KONG_PROXY_PORT=$KONG_PROXY_PORT

export TRANSMUTE_CONFIG=`pwd`/transmute-config/env.json


find $TRANSMUTE_CONFIG -type f | xargs sed -i 's/'$OLD_KONG_PROXY_PORT'/'$NEW_KONG_PROXY_PORT'/g'


curl -k -X GET \
    --url $KONG_ADMIN_URL/apis
