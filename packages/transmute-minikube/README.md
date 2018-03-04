# Transmute Minikube

Travis CI + Minikube tests for the Transmute Platform and Framework.

### Reading

- https://hackernoon.com/api-testing-with-jest-d1ab74005c0a


```
export KONG_ADMIN=$(minikube service --url mini-kong-kong-admin)
export KONG_PROXY=$(minikube service --url mini-kong-kong-proxy)

curl -i -X POST \
  --url $KONG_ADMIN/apis/ \
  --data 'name=example-api' \
  --data 'hosts=example.com' \
  --data 'upstream_url=10.107.89.122'

```