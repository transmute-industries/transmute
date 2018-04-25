#!/bin/sh
: ${USE_VOX:=y}

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

helm ls

kubectl get services

curl -k -X GET \
  --url $KONG_ADMIN_URL/apis/ipfs/plugins | jq

speaker 'transmute is operational'
