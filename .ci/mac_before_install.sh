#!/bin/bash
export CWD=$(pwd)
: ${TRANSMUTE_DIR:=$HOME/.transmute}
: ${TRANSMUTE_BIN:=$TRANSMUTE_DIR/bin}
: ${TRANSMUTE_REPO:=$TRANSMUTE_DIR/git/transmute}
: ${HELM_VERSION:='v2.8.2'}
: ${HELM_PREFIX:="$HOME/.local/bin"}
: ${HELM_URL:="https://storage.googleapis.com/kubernetes-helm/helm-v2.9.1-darwin-amd64.tar.gz"}

TMP=$(mktemp -d)
cleanup_tmp () {
  rm -Rf $TMP
}

trap cleanup_tmp EXIT
cd $TMP

errror () {
  echo "-------------------------------------------------------------"
  printf "\n \n  "
  echo "ERROR!!!  --  "
}

chkdir () {
  if [ ! -w $1 ] ; then
    sudo mkdir -p $1
    echo "sudo chown $USER $1"
    sudo chown $USER $1
  fi
  if [ ! -w $1 ] ; then
    errror
    echo "Cannot write to $1, please check your permissions"
    exit 2
  fi
}

gethelm () {

  echo "Installing $HELM_VERSION"
  curl -sL $HELM_URL -o helm.tgz
  echo $TMP
  tar zxvf helm.tgz

  cd darwin-amd64
  chmod +x helm
  mkdir $HELM_PREFIX
  sudo mv helm $HELM_PREFIX/helm
}

chkdir /etc/kubernetes
chkdir /etc/kubernetes/addons
chkdir /etc/systemd
chkdir /var/lib
chkdir /var/lib/localkube
chkdir /var/lib/localkube/certs
chkdir /lib/systemd/system


if [[ ! -e "$HOME/.local/bin/helm" ]]; then
  gethelm
fi
