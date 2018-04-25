#!/bin/sh
echo 'running mac before_scripts'
mkdir -p ~/.gnupg
touch ~/.gnupg/gpg.conf
sudo chown travis ~/.gnupg/gpg.conf
chmod 0600 ~/.gnupg/gpg.conf
gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
rvm get stable
