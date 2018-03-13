# Setting up Ganache-CLI on minikube

In this tutorial, you will learn how to use `helm` and `kubectl` to setup ganache-cli (formerly testrpc) in minikube.

We'll assume you have already setup `minikube` and `helm`. if you have not, see this [minikube setup tutorial](../README.md).

## Start Minikube

```
minikube start
```

## Install Ganache and Kong

```
helm install ./ganache-cli --name=mini-ganache
helm install stable/kong --name kong-mini


Add the minkube ip to `/etc/hosts`, this is important to ensure that network requests will include the correct Host header, which Kong will use to route your requests to the correct api inside the cluster.
```

echo "$(minikube ip) transmute.minikube" | sudo tee -a /etc/hosts
echo "$(minikube ip) ganache.transmute.minikube" | sudo tee -a /etc/hosts

```

```

## Testing Ganache

We need to use the NodePort services to expose the rpc interface:

```
export GANACHE_CLI=$(minikube service mini-ganache-ganache-cli --url)
```

Ask for the client version:

```
curl -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' $GANACHE_CLI; echo
```

Next, make sure to get the IP address of minikube.

```
minikube ip
```

The rest of this tutorial assumes the minikube ip address is `192.168.99.100`.

Now we can configure Kong to secure IPFS. First, use `kubectl` to get the `ClusterIP` of IPFS.

```
kubectl get services
```

The rest of this tutorial assumes the `ClusterIP` of ipfs is `10.111.23.116`.

Now lets add the ipfs api to kong:

```
curl -k -X POST \
  --url https://192.168.99.100:32444/apis/ \
  --data 'name=ganache' \
  --data 'hosts=ganache.transmute.minikube' \
  --data 'upstream_url=http://10.111.23.116:8545/'
```

Confirm Kong is forwarding requests to ganache:

```
curl -k -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' https://ganache.transmute.minikube:32443/; echo
```

## Cleanup

Remove the things created in this tutorial:

```
helm delete --purge mini-ganache
```
