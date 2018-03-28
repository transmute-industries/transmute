
helm delete --purge decentralized-storage

# curl -k -X DELETE \
#   --url $KONG_ADMIN_URL/apis/ipfs/plugins/cea869a3-faa4-44ae-a4d7-2e81a0cb32ef | jq


curl -k -X DELETE \
  --url $KONG_ADMIN_URL/apis/ipfs | jq

curl -k -X DELETE \
  --url $KONG_ADMIN_URL/consumers/bob@example.com | jq

helm delete --purge gateway 

rm ./setup/okta.pem

say 'helm teardown complete.'