


```

echo "$(minikube ip) kong.transmute.minikube" | sudo tee -a /etc/hosts

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/CN=kong.transmute.minikube"

kubectl -n kube-system create secret tls kong-tls-cert --key=tls.key --cert=tls.crt

kubectl apply -f kong-ingress.yaml

curl -k -I --resolve kong.transmute.minikube:192.168.99.100 https://kong.transmute.minikube/ 

curl -k -i https://kong.transmute.minikube/apis 
```