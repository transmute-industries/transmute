

```
helm install --name test-api ./test-api-chart --set service.type=NodePort

export POD_NAME=$(kubectl get pods --namespace default -l "app=test-api-chart,release=test-api"  -o jsonpath="{.items[0].metadata.name}")

kubectl --namespace default port-forward $POD_NAME 3001:3001
```