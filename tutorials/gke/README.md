### Transmute Platform on GKE

- [Getting Started](https://medium.com/google-cloud/kubernetes-nodeport-vs-loadbalancer-vs-ingress-when-should-i-use-what-922f010849e0)

```
curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get | bash

kubectl create serviceaccount -n kube-system tiller

kubectl create clusterrolebinding tiller-binding \
    --clusterrole=cluster-admin \
    --serviceaccount kube-system:tiller

kubectl create clusterrolebinding add-on-cluster-admin --clusterrole=cluster-admin --serviceaccount=kube-system:default

helm init --service-account tiller
```


#### Installing Micro Services

```
helm install stable/ipfs --name decentralized-storage --namespace alpha --set service.type=NodePort
helm install stable/kong --name gateway --namespace alpha
kubectl get services --namespace alpha
```


```
export IPFS_CLUSTER_IP=$(kubectl --namespace alpha get service decentralized-storage-ipfs -o json | jq -r '.spec.clusterIP');

export IPFS_POD=$(kubectl get pods --namespace alpha -l "app=ipfs,release=decentralized-storage"  -o jsonpath="{.items[0].metadata.name}")

echo "Use the API Gateway by accessing http://localhost:8080/ipfs/<IPFS-HASH>"

export KONG_HOST=$(kubectl get nodes --namespace alpha -o jsonpath='{.items[0].status.addresses[0].address}')
export KONG_PORT=$(kubectl get svc --namespace alpha gateway-kong-admin -o jsonpath='{.spec.ports[0].nodePort}')
export KONG_ADMIN=https://$KONG_HOST:$KONG_PORT

kubectl --namespace alpha port-forward $IPFS_POD 8080:8080

kubectl port-forward -n alpha gateway-kong-7f5c9bd559-lpjcm 8444:8444

```

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

```
curl -k -X POST \
  --url https://localhost:8444/apis/ \
  --data 'name=ipfs' \
  --data 'hosts=ipfs-alpha.transmute.network' \
  --data "https_only=true" \
  --data 'upstream_url=http://'$IPFS_CLUSTER_IP':5001/'

curl -k -X POST \
  --url https://localhost:8444/apis/ipfs/plugins \
  --data "name=cors" \
  --data "config.origins=*" \
  --data "config.methods=GET, PUT, POST"
```

```
helm install --name cert-manager \
    --namespace kube-system stable/cert-manager


export EMAIL=ahmet@example.com

curl -sSL https://rawgit.com/ahmetb/gke-letsencrypt/master/yaml/letsencrypt-issuer.yaml | \
    sed -e "s/email: ''/email: $EMAIL/g" | \
    kubectl apply -f-


gcloud compute addresses create kong-proxy --global

# gcloud compute addresses delete kong-ip --global

```

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: kong-ingress
  namespace: alpha
  annotations:
    kubernetes.io/ingress.global-static-ip-name: kong-ip
    ingress.kubernetes.io/ssl-passthrough: "true"
spec:
  backend:
    serviceName: gateway-kong-proxy
    servicePort: 8443
```



### Setup Ingress for Kong

`kubectl apply -f kong-ingress.yaml`

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: kong-admin-ingress
  namespace: alpha
spec:
  backend:
    serviceName: gateway-kong-admin
    servicePort: 8444
```



<!-- 
### [Setup Lets Encrypt](https://github.com/ahmetb/gke-letsencrypt)

```
git clone https://github.com/jetstack/cert-manager.git
cd cert-manager

# use a supported tag (see https://github.com/jetstack/cert-manager/releases)
git checkout v0.2.3

helm install \
    --name cert-manager \
    --namespace kube-system \
    contrib/charts/cert-manager \
    --set rbac.enabled=false


export EMAIL=bob@example.com

curl -sSL https://rawgit.com/ahmetb/gke-letsencrypt/master/yaml/letsencrypt-issuer.yaml | \
    sed -e "s/email: ''/email: $EMAIL/g" | \
    kubectl apply -f-


gcloud compute addresses create ipfs-ip --global
``` -->
