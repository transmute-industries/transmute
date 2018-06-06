#!/bin/bash -l

if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
  bash .ci/linux_before_install.sh
fi

echo PATH=$HOME/.transmute/bin:$PATH >> $HOME/.bashrc
echo PATH=$HOME/.local/bin:$PATH >> $HOME/.bashrc
if [[ ! -e "/usr/local/bin/minikube" ]]; then
  curl -Lo minikube https://storage.googleapis.com/minikube/releases/$MINIKUBE_VERSION/minikube-linux-amd64 \
    && chmod +x minikube && sudo mv minikube /usr/local/bin/
fi
mkdir -p $HOME/.local/bin
cd $HOME; rm -Rf .transmute; mkdir -p .transmute/git; cd .transmute/git; ln -s $TRAVIS_BUILD_DIR transmute
cd $TRAVIS_BUILD_DIR
TRANSMUTE_RELEASE=$TRAVIS_BRANCH bash -l ./bootstrap
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
