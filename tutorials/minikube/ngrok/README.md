# ngrok

Useful for enabling public internet access to local services via a tunnel.

We'll be exposing kong running in minikube locally via ngrok, and using lets encrypt to secure out microservices:


## Setup ngrok

Create an account on ngrok.com, reserve a domain, in this case: kong.transmute.live

Set kong address to minikube kong NodePort address.

```
authtoken: TOKEN
tunnels:
  kong:
    addr: 192.168.99.100:32443
    proto: tls
    hostname: kong.transmute.live
```

Start ngrok...

```
ngrok start --all
```

Confirm ngrok is forwarding to kong correctly, make sure to change the host in the url:

```
curl -k -X GET \
  --url https://kong.transmute.live/api/v0/id \
  --header 'Host: ipfs.transmute.minikube'
```

## Add certbot cronjob to minikube

```
kubectl apply -f ./certbot.yml
kubectl delete -f ./certbot.yml
```

## Add certbot api to kong

```
curl -k -i -X POST \
  --url https://192.168.99.100:32444/apis/ \
  --data 'name=certbot' \
  --data 'uris=/.well-known/acme-challenge' \
  --data 'methods=GET,OPTIONS' \
  --data 'strip_uri=true' \
  --data 'http_if_terminated=true' \
  --data 'upstream_url=http://kong-certbot-agent.default.svc.cluster.local/.well-known/acme-challenge/'
```

Getting and deleting apis:

```
curl -k -X GET \
  --url https://192.168.99.100:32444/apis/ | jq -r '.'

curl -k -X DELETE \
  --url https://192.168.99.100:32444/apis/ganache
```

## Check for certs

```
curl -k -i -X GET \
  --url https://192.168.99.100:32444/certificates/
```

## Delete Certs

```
curl -k -i -X DELETE \
  --url https://192.168.99.100:32444/certificates/ipfs.transmute.minikube
```


## Further Reading

- https://medium.com/@jotarios/ngrok-secure-tunnels-local-dead8685bd71
- https://github.com/luispabon/kong-certbot-agent

