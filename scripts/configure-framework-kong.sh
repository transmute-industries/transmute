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

export TARGET_DIR=`pwd`/packages/transmute-framework/src

echo 'Updating Kong Proxy Port in' $TARGET_DIR
echo 'Changing  ' $OLD_KONG_PROXY_PORT
echo 'To        ' $NEW_KONG_PROXY_PORT

find $TARGET_DIR -type f | xargs sed -i '' 's/'$OLD_KONG_PROXY_PORT'/'$NEW_KONG_PROXY_PORT'/g'

echo 'TRANSMUTE CONFIG'
cat `pwd`/packages/transmute-framework/src/transmute-config.json