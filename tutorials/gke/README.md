

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

```