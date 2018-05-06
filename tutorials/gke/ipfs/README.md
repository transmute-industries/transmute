# IPFS on GKE



## Install IPFS with Helm as NodePort
```
helm install stable/ipfs --name decentralized-storage --namespace alpha
helm install ./transmute-ipfs --name transmute-ipfs-dev
kubectl get services --namespace alpha
```


## Create a Global Static IP
```
gcloud compute addresses create ipfs-gateway --global

# gcloud compute addresses delete ipfs-gateway --global

```


## Configure Ingress

`kubectl apply -f ipfs-ingress.yaml`

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ipfs
  namespace: alpha
  annotations:
    kubernetes.io/ingress.global-static-ip-name: ipfs-gateway
  labels:
    app: ipfs
spec:
  backend:
    serviceName: decentralized-storage-ipfs
    servicePort: 8080
```



