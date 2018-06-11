#!/bin/bash
export CWD=$(pwd)
: ${TRANSMUTE_DIR:=$HOME/.transmute}
: ${TRANSMUTE_BIN:=$TRANSMUTE_DIR/bin}
: ${TRANSMUTE_REPO:=$TRANSMUTE_DIR/git/transmute}
: ${HELM_VERSION:='v2.8.2'}
: ${HELM_PREFIX:="$HOME/.local/bin"}
: ${HELM_URL:="https://storage.googleapis.com/kubernetes-helm/helm-$HELM_VERSION-linux-amd64.tar.gz"}

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

  cd linux-amd64
  chmod +x helm
  sudo mv helm $HELM_PREFIX/helm
}

mknsenter () {
  set -e

  sudo apt-get update
  sudo apt-get install libncurses5-dev libslang2-dev gettext zlib1g-dev libselinux1-dev debhelper lsb-release pkg-config po-debconf autoconf automake autopoint libtool

  wget https://www.kernel.org/pub/linux/utils/util-linux/v2.30/util-linux-2.30.2.tar.gz -qO - | tar -xz -C $TMP/
  cd $TMP/util-linux-2.30.2 && ./autogen.sh && ./configure && make nsenter
  mkdir -p $HOME/.local/bin
  sudo cp -v $TMP/util-linux-2.30.2/nsenter $HOME/.local/bin/nsenter
  sudo chmod +x $HOME/.local/bin/nsenter
}

chkdir /etc/kubernetes
chkdir /etc/kubernetes/addons
chkdir /etc/systemd
chkdir /var/lib
chkdir /var/lib/localkube
chkdir /var/lib/localkube/certs
chkdir /lib/systemd/system
#chkdir /usr/bin
chkdir /usr/local/bin

sudo apt-get update
sudo apt-get install -yqq \
  autopoint debhelper dh-apparmor intltool-debian jq libmail-sendmail-perl \
  libselinux1-dev libsepol1-dev libslang2-dev libsys-hostname-long-perl \
  jq build-essential libncurses5-dev libslang2-dev gettext zlib1g-dev \
  libselinux1-dev debhelper lsb-release pkg-config po-debconf \
  autoconf automake autopoint libtool python2.7-dev

if [[ ! -e "$HOME/.local/bin/nsenter" ]]; then
  mknsenter
fi
if [[ ! -e "/usr/bin/nsenter" ]]; then
  sudo cp -v $HOME/.local/bin/nsenter /usr/bin/nsenter
fi
if [[ ! -e "$HOME/.local/bin/helm" ]]; then
  gethelm
fi
if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
  echo "$HELM_SHA256 $HOME/.local/bin/helm" > /tmp/testhelm
  sha256sum -c /tmp/testhelm
  rm /tmp/testhelm
fi
