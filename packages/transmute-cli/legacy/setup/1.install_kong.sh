#!/bin/sh
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

speaker 'waiting for kong to wake up, come back '

#sleep $SECONDS_FOR_KONG
# while loop
countone=1
# timeout for 15 minutes
while [ $countone -lt 151 ]
do
  echo -n '.'
  RESULT=$(kubectl get po --namespace=default | grep gateway-kong | grep Running)
  if [ "$RESULT" ]; then
      sleep 3
      echo '.'
      echo "$RESULT"
      break
  fi
  countone=`expr $countone + 1`
  sleep 3
done
sleep 1

echo "Kong is now up and running.."

export KONG_ADMIN_URL=$(minikube service gateway-kong-admin --url | sed 's,http://,https://,g')
export KONG_PROXY_URL=$(minikube service gateway-kong-proxy --url | sed 's,http://,https://,g')

speaker 'kong is now ready...'

export KONG_NGROK_PROXY_URL=$(minikube service gateway-kong-proxy --url | sed 's,http://'$MINIKUBE_IP',https://'$KONG_NGROK_HOST',g')

echo "KONG_NGROK_PROXY_URL "$KONG_NGROK_PROXY_URL

curl -k -X GET \
  --url $KONG_ADMIN_URL/apis \
  | jq
