# Setting up IPFS on minikube

In this tutorial, you will learn how to use `helm` and `kubectl` to setup ipfs in minikube.

We'll assume you have already setup `minikube` and `helm`. if you have not, see this [minikube setup tutorial](../README.md).

## Start Minikube

```
minikube start
```

# Install IPFS Chart

```
helm install stable/ipfs --name transmute-ipfs --namespace transmute-ipfs
```

Test that ipfs install correctly by following the instructions logged to console. Here they are again:

```
export POD_NAME=$(kubectl get pods --namespace transmute-ipfs -l "app=ipfs,release=transmute-ipfs"  -o jsonpath="{.items[0].metadata.name}")
echo "Use the API Gateway by accessing http://localhost:8080/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme"
kubectl --namespace transmute-ipfs port-forward $POD_NAME 8080:8080 &
```

## Expose IPFS

```
kubectl get services --namespace transmute-ipfs
```

Note that this ipfs service is of type `ClusterIP`:

```
kubectl apply -f ./ipfs-gateway.service.yaml 
kubectl apply -f ./ipfs-api.service.yaml 
```

## Testing IPFS on Minikube

We need to use the NodePort services to expose both the api and gateway interfaces:

```
export IPFS_GATEWAY=$(minikube service --url ipfs-gateway --namespace transmute-ipfs)
export IPFS_API=$(minikube service --url ipfs-api --namespace transmute-ipfs)
```

### Check the readme

```
curl $IPFS_GATEWAY/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme
```

### Add a file via curl:

```
curl -F "file=@./test_data/nyan.gif" $IPFS_API/api/v0/add
```

### Add a json file via curl:

```
curl -F "data=@./test_data/data.json" $IPFS_API/api/v0/add
# {"Name":"data.json","Hash":"QmNsrSKdN13Q6VHiggU5aANg1GHapQJEBVzpHF22tJj8Ew"}
```

### Read a json file via curl:

```
curl $IPFS_GATEWAY/ipfs/QmNsrSKdN13Q6VHiggU5aANg1GHapQJEBVzpHF22tJj8Ew
```

### Pin the file you added:

```
curl $IPFS_API/api/v0/pin/add?arg=QmNsrSKdN13Q6VHiggU5aANg1GHapQJEBVzpHF22tJj8Ew
# {"Pins":["QmNsrSKdN13Q6VHiggU5aANg1GHapQJEBVzpHF22tJj8Ew"]}
```

### Unpin the file you added:

```
curl $IPFS_API/api/v0/pin/rm?arg=QmNsrSKdN13Q6VHiggU5aANg1GHapQJEBVzpHF22tJj8Ew
# {"Pins":["QmNsrSKdN13Q6VHiggU5aANg1GHapQJEBVzpHF22tJj8Ew"]}
```

### Call garbage collect

Perform a garbage collection sweep on the repo.

```
curl $IPFS_API/api/v0/repo/gc
```

## Cleanup

If you wish to restart this tutorial locally, here is how to delete everything that was created:

```
# delete your helm chart and remove data
helm delete transmute-ipfs --purge

# delete service interfaces
kubectl delete service ipfs-api ipfs-gateway --namespace transmute-ipfs
```