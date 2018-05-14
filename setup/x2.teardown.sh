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

curl -k -X DELETE \
  --url $KONG_ADMIN_URL/apis/ipfs/plugins/cea869a3-faa4-44ae-a4d7-2e81a0cb32ef | jq -r '.'

curl -k -X DELETE \
  --url $KONG_ADMIN_URL/apis/ipfs | jq -r '.'

curl -k -X DELETE \
  --url $KONG_ADMIN_URL/consumers/$KONG_CONSUMER_USERNAME | jq -r '.'

curl -k -X DELETE \
  --url $KONG_ADMIN_URL/apis/ganache

helm delete --purge gateway
helm delete --purge decentralized-storage
helm delete --purge ganache

rm ./setup/okta.pem

speaker 'helm teardown complete.'
