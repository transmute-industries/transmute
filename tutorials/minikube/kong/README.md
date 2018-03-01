* https://github.com/Kong/kong-dist-kubernetes/tree/master/minikube

### Install Kong

```
kubectl create -f cassandra.yaml
kubectl create -f kong_migration_cassandra.yaml
kubectl create -f kong_cassandra.yaml
```

### Test Kong

```
curl $(minikube service --url kong-admin)
curl $(minikube service --url kong-proxy|head -n1)

export KONG_API=$(minikube service --url kong-admin)
export KONG_PROXY=$(minikube service --url kong-proxy)
```

### Add an API

```
curl -i -X POST \
  --url $KONG_API/apis/ \
  --data 'name=example-api' \
  --data 'hosts=example.com' \
  --data 'upstream_url=http://mockbin.org'
```

### Test API Forwarding

```
curl -i -X GET \
  --url $KONG_PROXY/ \
  --header 'Host: example.com'
```
