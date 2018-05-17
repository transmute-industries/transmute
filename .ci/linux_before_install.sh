#!/bin/sh
export CWD=$(pwd)
: ${TRANSMUTE_DIR:=$HOME/.transmute}
: ${TRANSMUTE_BIN:=$TRANSMUTE_DIR/bin}
: ${TRANSMUTE_REPO:=$TRANSMUTE_DIR/git/transmute}

chkdir () {
  if [ ! -w $1 ] ; then
    sudo mkdir -p $1
    sudo chown $USER. $1
  fi
  if [ ! -w $1 ] ; then
    errror
    echo "Cannot write to $1, please check your permissions"
    exit 2
  fi
}

chkdir /etc/kubernetes
chkdir /etc/kubernetes/addons
chkdir /etc/systemd
chkdir /var/lib
chkdir /var/lib/localkube
chkdir /var/lib/localkube/certs
chkdir /lib/systemd/system
chkdir /usr/bin
chkdir /usr/local/bin

sudo apt-get update
sudo apt-get install -yqq \
  autopoint debhelper dh-apparmor intltool-debian jq libmail-sendmail-perl \
  libselinux1-dev libsepol1-dev libslang2-dev libsys-hostname-long-perl \
  jq build-essential libncurses5-dev libslang2-dev gettext zlib1g-dev \
  libselinux1-dev debhelper lsb-release pkg-config po-debconf \
  autoconf automake autopoint libtool python2.7-dev

if [[ "$TRAVIS_OS_NAME" == "linux" && ! -e "$HOME/.local/bin/nsenter" ]]; then
  .ci/ubuntu-compile-nsenter.sh
fi
if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
  sudo cp $HOME/.local/bin/nsenter /usr/bin/nsenter
fi
if [[ ! -e "$HOME/.local/bin/helm" ]]; then 
  sh $TRANSMUTE_REPO/.ci/gethelm
fi
if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then 
  echo "$HELM_SHA256 $HOME/.local/bin/helm" > /tmp/testhelm 
  sha256sum -c /tmp/testhelm 
  rm /tmp/testhelm
fi
