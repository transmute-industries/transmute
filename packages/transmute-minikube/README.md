# Transmute Minikube

Travis CI + Minikube tests for the Transmute Platform and Framework.

### Reading

* https://hackernoon.com/api-testing-with-jest-d1ab74005c0a

```
export KONG_ADMIN=$(minikube service --url mini-kong-kong-admin)
export KONG_PROXY=$(minikube service --url mini-kong-kong-proxy)

curl -k -i -X POST \
  --url https://192.168.99.100:32444/apis/ \
  --data 'name=example-api' \
  --data 'hosts=example.com' \
  --data 'upstream_url=http://10.107.89.122:8080/'


curl -k -i -X GET \
  --url https://192.168.99.100:32443/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme \
  --header 'Host: example.com'
```

Or you can use this chrome extension:

* https://chrome.google.com/webstore/detail/modify-headers-for-google/innpjfdalfhpcoinfnehdnbkglpmogdi?hl=en-US

To add the header from the command above.
