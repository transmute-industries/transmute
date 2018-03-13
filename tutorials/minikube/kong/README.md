* https://github.com/Kong/kong-dist-kubernetes/tree/master/minikube

### Install Kong

```
helm search kong
helm install stable/kong --name mini-kong
```

### Test Kong

```

export KONG_API=$(minikube service --url mini-kong-kong-admin)
export KONG_PROXY=$(minikube service --url mini-kong-kong-proxy)

```

Edit the URL to https and use -k to ignore SSL cert issues when testing locally.

### Add an API

Use `kubectl get services` to get your ipfs ClusterIP for use below:

```
curl -k -X POST \
  --url https://192.168.99.100:32444/apis/ \
  --data 'name=ipfs' \
  --data 'hosts=ipfs.transmute.network' \
  --data 'upstream_url=http://10.107.89.122:8080/'
```


### Delete an API

```
curl -k -X DELETE --url https://192.168.99.100:32444/apis/ipfs
```

### Test API Forwarding

```
curl -k -X GET \
  --url https://192.168.99.100:32443/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme \
  --header 'Host: ipfs.transmute.network'
```

### Browser Testing

Either edit your `/etc/hosts` file like so:

```
192.168.99.100  ipfs.transmute.network
```

Or use a chrome extension to inject the correct header.

* https://chrome.google.com/webstore/detail/modify-headers-for-google/innpjfdalfhpcoinfnehdnbkglpmogdi?hl=en-US


### Adding Okta Plugin

```
http --verify=no POST https://192.168.99.100:32444/apis/ipfs/plugins name=oidc \
    config.client_id="CLIENT_ID" \
    config.client_secret="CLIENT_SECRET" \
    config.discovery="https://PREVIEW/oauth2/default/.well-known/openid-configuration"
```

### Adding JWT support

```
http --verify=no POST https://192.168.99.100:32444/apis/ipfs/plugins name=jwt

http --verify=no POST https://192.168.99.100:32444/consumers \
    username=bob@example.com \
    custom_id=0


curl -k -X POST https://192.168.99.100:32444/consumers/208fe57f-bd5a-4558-a156-c25c381164a9/jwt -H "Content-Type: application/x-www-form-urlencoded"

{
  "created_at":1520372540000,
  "id":"f3d60001-f358-4007-b693-58a483d2c69b",
  "algorithm":"HS256",
  "key":"9QcTV19el2CUzrKaclmKxBZU29izdPDM",
  "secret":"Pmz1kKWBkWb2MRscRS2V55z8bank1FC0",
  "consumer_id":"208fe57f-bd5a-4558-a156-c25c381164a9"
}

curl -k -X GET \
  --url https://192.168.99.100:32443/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme \
  --header 'Host: ipfs.transmute.network' \
  --header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9FRkROek5CTUVKQ00wRkVSalEyUXpjM05qZ3hSVU14TmpJd016VXdRMEUwT0RBME5USXhRZyJ9.eyJpc3MiOiJodHRwczovL3RyYW5zbXV0ZS1pbmR1c3RyaWVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1YTlmMTMyOWM0Mzc5NTRkZGE2NTIzYWUiLCJhdWQiOiJDYVk5MDE5RVpobUticlZGOG5nWHhsU2Z5NWdkVjZiMCIsImlhdCI6MTUyMDM3NjIzNywiZXhwIjoxNTIwNDEyMjM3LCJhdF9oYXNoIjoiaVRwT1J0NXcxTldaZFZlOFlBbmhXZyIsIm5vbmNlIjoic3hZMGNRMVNicTNTWHNHN0cubzE5Z2t-MFV1bmh6WHoifQ.o-opNVl8dxrWjYyiOSPSTMaQ8kWuNhrquO_SWOn0inYl6fI1lqjIE23aeFpggdt8-B7P7dWGZ46l_n_1Vfef7VSnJERsS8tsOwqaT75a4i-6-OMbPUvxxalfBYyU_exkXcEsdsStf5HZPCqPy8E-SpD9yLEQ_q5kuQ8rJb10L9_0d-joLPkX4e3cavEcQnXJ7k1RmddBlLovr0C8BARg9mE6d5u4TUZe5Wz1iZZSvrHHhZztxgmm-p1QETaCJNnyQd_QJoK-evT65K6sS1klqf7ubqwhEg7HjXIEeyQCdN5lxAjPbp_8jVeayH-1gGpLCP-dwrvoW74s3xLsu3tmWg'
  
```

