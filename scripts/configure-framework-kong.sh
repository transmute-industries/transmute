export KONG_ADMIN_URL=$(minikube service mini-kong-kong-admin --url | sed 's,http://,https://,g')
export KONG_PROXY_URL=$(minikube service mini-kong-kong-proxy --url | sed 's,http://,https://,g')
export KONG_PROXY_PORT=$(kubectl get service mini-kong-kong-proxy -o json | jq -r '.spec.ports[0].nodePort')

# TESTING

# export OLD_KONG_PROXY_PORT=32443
# export NEW_KONG_PROXY_PORT=11111

# export OLD_KONG_PROXY_PORT=11111
# export NEW_KONG_PROXY_PORT=32443

# REAL
export OLD_KONG_PROXY_PORT=32443
export NEW_KONG_PROXY_PORT=$KONG_PROXY_PORT

export FRAMEWORK_CONFIG=`pwd`/packages/transmute-framework/src/transmute-config.json
export CONTRACTS_CONFIG=`pwd`/packages/transmute-contracts/transmute-config.json

find $FRAMEWORK_CONFIG -type f | xargs sed -i 's/'$OLD_KONG_PROXY_PORT'/'$NEW_KONG_PROXY_PORT'/g'
find $CONTRACTS_CONFIG -type f | xargs sed -i 's/'$OLD_KONG_PROXY_PORT'/'$NEW_KONG_PROXY_PORT'/g'

echo 'FRAMEWORK_CONFIG'
cat $FRAMEWORK_CONFIG

echo 'CONTRACTS_CONFIG'
cat $CONTRACTS_CONFIG

curl -k -X GET \
    --url $KONG_ADMIN_URL/apis