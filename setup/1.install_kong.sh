#!/bin/sh
: ${USE_VOX:=y}
helm install stable/kong --name gateway

speaker () {
  WELCOME=$1
  echo $WELCOME
  if [ "$USE_VOX" = "true" ]; then
    if type "say"        > /dev/null 2> /dev/null; then
      say "$WELCOME"
    elif type "espeak"   > /dev/null 2> /dev/null; then
      espeak "$WELCOME"
    elif type "spd-say"  > /dev/null 2> /dev/null; then
      spd-say "$WELCOME"
    elif type "festival" > /dev/null 2> /dev/null; then
      echo "$WELCOME" | festival --tts
    fi
  fi
}

speaker 'waiting for kong to wake up, come back in '$SECONDS_FOR_KONG' seconds.'

echo 'please be patient while kong wakes up... seconds to wait: '$SECONDS_FOR_KONG

sleep $SECONDS_FOR_KONG

export KONG_ADMIN_URL=$(minikube service gateway-kong-admin --url | sed 's,http://,https://,g')
export KONG_PROXY_URL=$(minikube service gateway-kong-proxy --url | sed 's,http://,https://,g')

speaker 'kong is now ready...'

export KONG_NGROK_PROXY_URL=$(minikube service gateway-kong-proxy --url | sed 's,http://'$MINIKUBE_IP',https://'$KONG_NGROK_HOST',g')

echo "KONG_NGROK_PROXY_URL "$KONG_NGROK_PROXY_URL

curl -k -X GET \
  --url $KONG_ADMIN_URL/apis \
  | jq
