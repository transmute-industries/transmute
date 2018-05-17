#!/usr/bin/env bash -l
export PATH=$HOME/.transmute/bin:$PATH
export PATH=$HOME/.local/bin:$PATH
lerna bootstrap
erna run --scope transmute-cli build
erna exec --scope transmute-cli 'env'
erna exec --scope transmute-cli 'transmute help'
erna exec --scope transmute-cli 'transmute k8s provision --minikube'
erna exec --scope transmute-cli 'transmute k8s init --minikube'
#transmute help
#transmute k8s provision --minikube
#transmute k8s init --minikube
#sleep 1
#JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}'
#sleep 1
#until kubectl get nodes -o jsonpath="$JSONPATH" 2>&1 | grep -q "Ready=True"; do
  #sleep 1
#done
