echo "" | sudo tee -a /etc/hosts
echo "$(minikube ip)  transmute.minikube" | sudo tee -a /etc/hosts
echo "$(minikube ip)  ipfs.transmute.minikube" | sudo tee -a /etc/hosts
echo "$(minikube ip)  ganache.transmute.minikube" | sudo tee -a /etc/hosts
echo "" | sudo tee -a /etc/hosts

cat /etc/hosts