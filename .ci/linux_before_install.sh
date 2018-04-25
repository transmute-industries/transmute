#!/bin/sh
export CWD=$(pwd)

sudo apt-get install -yqq \
  autopoint debhelper dh-apparmor intltool-debian jq libmail-sendmail-perl \
  libselinux1-dev libsepol1-dev libslang2-dev libsys-hostname-long-perl \
  jq build-essential libncurses5-dev libslang2-dev gettext zlib1g-dev \
  libselinux1-dev debhelper lsb-release pkg-config po-debconf \
  autoconf automake autopoint libtool python2.7-dev

#curl -Lo kubectl https://storage.googleapis.com/kubernetes-release/release/v1.9.0/bin/linux/amd64/kubectl && chmod +x kubectl && sudo mv kubectl /usr/local/bin/
#curl -Lo minikube https://storage.googleapis.com/minikube/releases/v0.25.2/minikube-linux-amd64 && chmod +x minikube && sudo mv minikube /usr/local/bin/

if [ ! -e "/usr/local/bin/nsenter" ]; then
  TMP=$(mktemp -d)
  cd $TMP
  wget https://www.kernel.org/pub/linux/utils/util-linux/v2.25/util-linux-2.25.tar.gz
  tar -xvf util-linux-2.25.tar.gz
  cd util-linux-2.25
  ./configure
  make nsenter
  sudo cp nsenter /usr/local/bin
  cd $CWD
  rm -Rf $TMP
fi

if [ ! -e "$HOME/.transmute/bin/minikube" ]; then
  TMP=$(mktemp -d)
  cd $TMP
  curl -Lo minikube https://storage.googleapis.com/minikube/releases/$MINIKUBE_VERSION/minikube-linux-amd64 && chmod +x minikube && sudo mv minikube $HOME/.transmute/bin/
  cd $CWD
  rm -Rf $TMP
fi
