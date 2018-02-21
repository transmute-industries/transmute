

Finding the IPFS chart:

```
helm search ipfs
helm fetch stable/ipfs 
```

Installing a custom chart:

```
helm install ipfs/ --name tranmsute-ipfs --namespace transmute-ipfs


export POD_NAME=$(kubectl get pods --namespace transmute-ipfs -l "app=ipfs,release=tranmsute-ipfs"  -o jsonpath="{.items[0].metadata.name}")

kubectl --namespace transmute-ipfs port-forward $POD_NAME 5001:5001
```