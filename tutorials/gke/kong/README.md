# Kong on GKE

```
helm install stable/kong --name gateway --namespace alpha

gcloud compute addresses list --global
gcloud compute addresses create kong-proxy --global
# gcloud compute addresses delete kong-ip --global

```

### Setup Load Balancer

`kubectl apply -f ./loadbalancer.yaml`

```
---
apiVersion: v1
kind: Service
metadata:
  name: gateway-loadbalancer
  namespace: alpha
spec:
  ports:
  - port: 8443
    name: kong-proxy-port
  selector:
    app: kong
  type: LoadBalancer
  loadBalancerIP: 35.227.254.246
```


### Connect to the Admin API

```
export KONG_ADMIN_POD=$(kubectl get pods --namespace alpha -l "app=kong,release=gateway"  -o jsonpath="{.items[0].metadata.name}")

kubectl port-forward -n alpha $KONG_ADMIN_POD 8444:8444

curl -k -X GET \
  --url https://localhost:8444/apis

```

### Adding IPFS API to Kong

```
export IPFS_CLUSTER_IP=$(kubectl get service -n alpha decentralized-storage-ipfs -o json | jq -r '.spec.clusterIP');

curl -k -X POST \
  --url https://localhost:8444/apis/ \
  --data 'name=ipfs' \
  --data 'uris=/' \
  --data "https_only=true" \
  --data 'upstream_url=http://'$IPFS_CLUSTER_IP':5001/'

curl -k -X POST \
  --url https://localhost:8444/apis/ipfs/plugins \
  --data "name=cors" \
  --data "config.origins=*" \
  --data "config.methods=GET, PUT, POST"
```

Use the loadbalancer IP to test that kong is proxying to ipfs correctly based on host header:

```
curl -k -X GET \
  --url https://XXX.XXX.XXX.XXX:8443/api/v0/id \
  --header 'Host: ipfs.transmute.network'
```

### Deleting APIS

```
curl -k -X DELETE \
  --url https://localhost:8444/apis/ipfs
```

### Adding SSL

- https://github.com/ahmetb/gke-letsencrypt

For now, we will be using a kinda hacky approach to SSL... We will be getting SSL certs via ingress, and then forwarding them to kong so the load balancer can use them.

# BE PATIENT

These commands take many minutes to complete. 

You will see 404 and 500 errors until the process is complete.

Don't get nervous and start hitting F5, it will just make things feel longer... 

It takes a really, REALLY, long time...
chill, go outside or something... 15 minutes.

`kubectl apply -f ./ipfs-transmute-network-cert.yaml`

```
apiVersion: certmanager.k8s.io/v1alpha1
kind: Certificate
metadata:
  name: ipfs-transmute-network-tls
  namespace: default
spec:
  secretName: ipfs-transmute-network-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  commonName: ipfs.transmute.network
  dnsNames:
  - ipfs.transmute.network
  acme:
    config:
    - http01:
        ingress: helloweb
      domains:
      - ipfs.transmute.network
```

Check for the secret...

```
kubectl get secrets -n alpha
kubectl describe -f ./ipfs-transmute-network-cert.yaml
kubectl get secret ipfs-transmute-network-tls -o yaml
```

### Getting the Cert

You will need to convert to PEM format:

```
kubectl get secret ipfs-transmute-network-tls -o json >> ipfs-transmute-network-tls.json
cat example.crt | base64 --decode
```

### Add the cert to kong

```
curl -k -i -X POST https://localhost:8444/certificates \
  -F "cert=@ipfs.crt" \
  -F "key=@ipfs.key" \
  -F "snis=ipfs.transmute.network"
```

### Use the CERT

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: helloweb
  annotations:
    kubernetes.io/ingress.global-static-ip-name: helloweb-ip
  labels:
    app: hello
spec:
  backend:
    serviceName: helloweb-backend
    servicePort: 8080
  tls:
  - secretName: ipfs-transmute-network-tls
    hosts:
    - ipfs.transmute.network
```


Maybe use this instead...

https://github.com/luispabon/kong-certbot-agent

## Cleanup

```
kubectl delete -f ./ipfs-transmute-network-cert.yaml
```