#!/bin/sh
: ${USE_VOX:=y}

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

helm ls

kubectl get services

curl -k -X GET \
  --url $KONG_ADMIN_URL/apis/ipfs/plugins | jq -r '.'

speaker 'transmute is operational'
