
### Reading

* https://kubernetes.io/docs/tasks/tools/install-minikube/
* https://kubernetes.io/docs/getting-started-guides/minikube/
* https://docs.helm.sh/using_helm/#quickstart
* https://docs.bitnami.com/kubernetes/how-to/create-your-first-helm-chart/
* https://docs.microsoft.com/en-us/azure/aks/intro-kubernetes

### Some setup commands from above

```
curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/darwin/amd64/kubectl

chmod +x ./kubectl

sudo mv ./kubectl /usr/local/bin/kubectl

curl -Lo minikube https://storage.googleapis.com/minikube/releases/v0.25.0/minikube-darwin-amd64 && chmod +x minikube && sudo mv minikube /usr/local/bin/

brew install kubernetes-helm
helm init
```
