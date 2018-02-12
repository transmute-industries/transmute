# Setting up Ganache-CLI on minikube

In this tutorial, you will learn how to use `helm` and `kubectl` to setup ganache-cli (formerly testrpc) in minikube.

We'll assume you have already setup `minikube` and `helm`. if you have not, see this [minikube setup tutorial](../README.md).

## Start Minikube

```
minikube start
```

## Install Ganache-CLI with Helm

```
helm install ./ganache-cli --name=transmute-testrpc --namespace transmute-testrpc
```

## Testing Ganache-CLI on Minikube

We need to use the NodePort services to expose the rpc interface:

```
export GANACHE_CLI=$(minikube --namespace transmute-testrpc service transmute-testrpc-ganache-cli --url)
```

Ask for the client version:  

```
curl -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' $GANACHE_CLI; echo
```

## Cleanup

Remove the things created in this tutorial:

```
helm delete --purge transmute-testrpc
```




