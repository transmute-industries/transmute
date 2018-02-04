### Running IPFS on minikube

```
helm install --name transmute-ipfs stable/ipfs
```

If you want to connect to it from your local computer, you can find a URL to connect with the
following (for the gateway service):

```
export POD_NAME=$(kubectl get pods --namespace default -l "app=ipfs,release=transmute-ipfs"  -o jsonpath="{.items[0].metadata.name}")
echo "Use the API Gateway by accessing http://localhost:8080/ipfs/<IPFS-HASH>"
kubectl --namespace default port-forward $POD_NAME 8080:8080 5001:5001 4001:4001
```
