#!/bin/bash -l
TRAVIS='true'
PATH=$HOME/.transmute/bin:$PATH
PATH=$HOME/.local/bin:$PATH
KUBE_VERSION=v1.8.0
DO_JWT_DL=n
VERBOSITY=10
CHANGE_MINIKUBE_NONE_USER=true
MINIKUBE_VERSION=v0.25.2
USE_VOX=n
USE_WARN=n
EDITOR=cat
MINIKUBE_MEMORY=7777
MINIKUBE_CPU=4
MINIKUBE_DISK=50g
MINIKUBE_DRIVER=none
HELM_INSTALL_DIR=$HOME/.local/bin
HELM_VERSION=v2.8.2
NVM_DIR="$HOME/.nvm"
HELM_SHA256=0521956fa22be33189cc825bb27b3f4178c5ce9a448368b5c81508d446472715
CWD=$(pwd)


if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
  bash .ci/linux_before_install.sh
fi
cd $CWD
pwd

echo PATH=$HOME/.transmute/bin:$PATH >> $HOME/.bashrc
echo PATH=$HOME/.local/bin:$PATH >> $HOME/.bashrc
if [[ ! -e "/usr/local/bin/minikube" ]]; then
  curl -Lo minikube https://storage.googleapis.com/minikube/releases/$MINIKUBE_VERSION/minikube-linux-amd64 \
    && chmod +x minikube && sudo mv minikube /usr/local/bin/
fi
mkdir -p $HOME/.local/bin
cd $HOME; rm -Rf .transmute; mkdir -p .transmute/git; cd .transmute/git; ln -s $TRAVIS_BUILD_DIR transmute
cd $TRAVIS_BUILD_DIR
cd $CWD
pwd
TRANSMUTE_RELEASE=$TRAVIS_BRANCH bash ./bootstrap
export PATH=$HOME/.transmute/bin:$PATH
cd $TRAVIS_BUILD_DIR/packages/transmute-cli
npm i
npm run build
npm i -g
cd $TRAVIS_BUILD_DIR
npm i
if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
  transmute k8s provision-minikube travistest --vmdriver none
fi
sleep 8
minikube update-context
if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
  yes y|transmute k8s init travistest
fi
lerna bootstrap
sleep 8
kubectl get pods --all-namespaces
kubectl get svc --all-namespaces
kubectl describe pod $(kubectl get pod --all-namespaces|grep gateway-kong-migrations|awk '{print $2}')
kubectl describe pod $(kubectl get pod --all-namespaces|grep -v gateway-kong-migrations|grep gateway-kong|awk '{print $2}')
TRANSMUTE_ENV='minikube' lerna run --scope transmute-framework truffle:test
TRANSMUTE_ENV='minikube' lerna run --scope transmute-framework truffle:migrate
TRANSMUTE_ENV='minikube' lerna run --scope transmute-framework test
TRANSMUTE_ENV='minikube' lerna run --scope transmute-framework test:report
