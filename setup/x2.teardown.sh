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

curl -k -X DELETE \
  --url $KONG_ADMIN_URL/apis/ipfs/plugins/cea869a3-faa4-44ae-a4d7-2e81a0cb32ef | jq

curl -k -X DELETE \
  --url $KONG_ADMIN_URL/apis/ipfs | jq

curl -k -X DELETE \
  --url $KONG_ADMIN_URL/consumers/$KONG_CONSUMER_USERNAME | jq

curl -k -X DELETE \
  --url $KONG_ADMIN_URL/apis/ganache

helm delete --purge gateway
helm delete --purge decentralized-storage
helm delete --purge ganache

rm ./setup/okta.pem

speaker 'helm teardown complete.'
