#!/bin/sh

sudo apt-get install -yqq \
  autopoint debhelper dh-apparmor intltool-debian jq libmail-sendmail-perl \
  libselinux1-dev libsepol1-dev libslang2-dev libsys-hostname-long-perl \
  po-debconf

export CWD=$(pwd)
curl -Lo kubectl https://storage.googleapis.com/kubernetes-release/release/v1.9.0/bin/linux/amd64/kubectl && chmod +x kubectl && sudo mv kubectl /usr/local/bin/
curl -Lo minikube https://storage.googleapis.com/minikube/releases/v0.25.2/minikube-linux-amd64 && chmod +x minikube && sudo mv minikube /usr/local/bin/
sudo minikube start --vm-driver=none --kubernetes-version=v1.9.0
minikube update-context
JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}'; until kubectl get nodes -o jsonpath="$JSONPATH" 2>&1 | grep -q "Ready=True"; do sleep 1; done

sudo apt-get install jq build-essential libncurses5-dev libslang2-dev gettext zlib1g-dev libselinux1-dev debhelper lsb-release pkg-config po-debconf autoconf automake autopoint libtool python2.7-dev
cd /tmp
wget https://www.kernel.org/pub/linux/utils/util-linux/v2.25/util-linux-2.25.tar.gz
tar -xvf util-linux-2.25.tar.gz
cd util-linux-2.25
./configure
make nsenter
sudo cp nsenter /usr/local/bin
cd $CWD

curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get | bash
helm init --force-upgrade --tiller-image powerhome/tiller:git-3b22ecd

node -v
npm -v

npm install -g codecov lerna@2.9.0 truffle@4.1.3

lerna -v
truffle version

sleep 60
kubectl cluster-info
nsenter --version
minikube addons enable ingress
