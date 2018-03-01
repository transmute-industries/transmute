


```

kubectl run echoserver --image=gcr.io/google_containers/echoserver:1.4 --port=8080
kubectl expose deployment echoserver --type=NodePort
minikube service echoserver


echo "$(minikube ip) echoserver.minikube" | sudo tee -a /etc/hosts


openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/CN=echoserver.minikube"

kubectl -n kube-system create secret tls echoserver-tls-cert --key=tls.key --cert=tls.crt

kubectl apply -f echoserver-ingress.yaml

curl -k -I --resolve echoserver.minikube:192.168.99.100 https://echoserver.minikube/ 
```