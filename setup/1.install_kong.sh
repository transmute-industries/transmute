#!/bin/bash
: ${USE_VOX:=y}
helm install stable/kong --name gateway

speaker () {
  WELCOME=$1
  echo $WELCOME
  if [ "$USE_VOX" = y ]; then
    if type "say"        > /dev/null 2> /dev/null; then
      say "$WELCOME"
    elif type "festival" > /dev/null 2> /dev/null; then
      echo "$WELCOME" | festival --tts > /dev/null 2> /dev/null
    elif type "espeak"   > /dev/null 2> /dev/null; then
      espeak "$WELCOME"  > /dev/null 2> /dev/null
    elif type "spd-say"  > /dev/null 2> /dev/null; then
      spd-say "$WELCOME" > /dev/null 2> /dev/null
    fi
  fi
}

speaker 'Waiting for kong to wake up, come back '

# required because kubectl will lie about kong being ready.
sleep 500

export KONG_ADMIN_URL=$(minikube service gateway-kong-admin --url | sed 's,http://,https://,g')

curl -k -X GET \
  --url $KONG_ADMIN_URL/apis \
  | jq -r '.'
