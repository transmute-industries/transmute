#!/bin/sh
: ${USE_VOX:=y}
echo 'Adding Proxy Cert to Kong\n'

echo $KONG_ADMIN_URL

sudo curl -k -i -X POST $KONG_ADMIN_URL/certificates \
  -F "cert=@/etc/letsencrypt/live/"$KONG_NGROK_HOST"/fullchain.pem" \
  -F "key=@/etc/letsencrypt/live/"$KONG_NGROK_HOST"/privkey.pem" \
  -F "snis="$KONG_NGROK_HOST
