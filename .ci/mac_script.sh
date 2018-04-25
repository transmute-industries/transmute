#!/bin/sh
echo 'running mac scripts'
mkdir -p ~/.gnupg
touch ~/.gnupg/gpg.conf
sudo chown travis ~/.gnupg/gpg.conf
chmod 0600 ~/.gnupg/gpg.conf
