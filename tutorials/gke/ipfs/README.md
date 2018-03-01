https://github.com/ahmetb/gke-letsencrypt


Finding the IPFS chart:

```
helm search ipfs
helm fetch stable/ipfs 
```

Installing a custom chart:

```
helm install transmute-ipfs

follow instuctions to test...


kubectl apply -f loadbalancer.yaml
```
