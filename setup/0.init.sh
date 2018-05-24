#!/bin/sh
: ${USE_VOX:=y}
: ${TRANSMUTE_DIR:=$HOME/.transmute}
: ${TRANSMUTE_BIN:=$TRANSMUTE_DIR/bin}
: ${TRANSMUTE_REPO:=$TRANSMUTE_DIR/git/transmute}

# http://patorjk.com/software/taag/#p=display&f=ANSI%20Shadow

speaker () {
  WELCOME=$1
  echo $WELCOME
  if [ "$USE_VOX" = y ]; then
    if type "say"        > /dev/null 2> /dev/null; then
      say "$WELCOME"
    elif type "festival" > /dev/null 2> /dev/null; then
      echo "$WELCOME" | festival --tts > /dev/null 2> /dev/null
    elif type "espeak"   > /dev/null 2> /dev/null; then
      espeak "$WELCOME"  > /dev/null 2> /dev/null
    elif type "spd-say"  > /dev/null 2> /dev/null; then
      spd-say "$WELCOME" > /dev/null 2> /dev/null
    fi
  fi
}

bail () {
  speaker "then I am bailing out, you will need to create the environment file at  ./transmute-config/.env" answer
  exit 1
}

speaker 'Welcome to Transmute'
speaker 'Should I continue speaking? (y or n)'

read -p '[yn]' USE_VOX
export USE_VOX=$USE_VOX

speaker "You should have run 'npm i' before this script. exit now if thats not the case."

speaker "Make sure minikube is running."

speaker "Also make sure you have configured your .env correctly with okta."

speaker "You will need an okta application with 'Resource Owner Password' and 'Client Authentication' for OKTA_CLIENT_ID and OKTA_CLIENT_SECRET."


speaker 'This guide will help you setup your environment.'
speaker 'Let me check your transmute-config.'


# ███████╗███████╗████████╗██╗   ██╗██████╗      ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗ 
# ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗    ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ 
# ███████╗█████╗     ██║   ██║   ██║██████╔╝    ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
# ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝     ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
# ███████║███████╗   ██║   ╚██████╔╝██║         ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
# ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝          ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝ 
                                                                                             

if [ -e "$TRANSMUTE_REPO/transmute-config/.env" ]; then
  speaker "Transmute Config has been found here $TRANSMUTE_REPO/transmute-config/.env"
else
  speaker "Would you like me to copy the example environment file?"
  read -p '[yn]' answer
  if [ "$answer" = y ] ; then
    # run the command
    speaker "ok, I will copy the example environment file to $TRANSMUTE_REPO/transmute-config/.env"
    cp $TRANSMUTE_REPO/transmute-config/.example.env  $TRANSMUTE_REPO/transmute-config/.env
  else
    bail
  fi
fi

speaker "Would you like to edit the environment file?"
read -p '[yn]' answer
if [ "$answer" = y ] ; then
  if [ ! -z "$EDITOR" ] ; then
    $EDITOR $TRANSMUTE_REPO/transmute-config/.env
  else
    speaker "You will need to set your EDITOR environment variable"
    exit 1
  fi
fi

if [ -e "$TRANSMUTE_REPO/transmute-config/.env" ]; then
  speaker "Press enter to continue if you are satisfied with transmute-config/.env" &
  read -p ' ' answer
else
  bail
fi

. $TRANSMUTE_REPO/transmute-config/.env

# ██╗███╗   ██╗███████╗████████╗ █████╗ ██╗     ██╗         ██╗  ██╗ ██████╗ ███╗   ██╗ ██████╗ 
# ██║████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██║     ██║         ██║ ██╔╝██╔═══██╗████╗  ██║██╔════╝ 
# ██║██╔██╗ ██║███████╗   ██║   ███████║██║     ██║         █████╔╝ ██║   ██║██╔██╗ ██║██║  ███╗
# ██║██║╚██╗██║╚════██║   ██║   ██╔══██║██║     ██║         ██╔═██╗ ██║   ██║██║╚██╗██║██║   ██║
# ██║██║ ╚████║███████║   ██║   ██║  ██║███████╗███████╗    ██║  ██╗╚██████╔╝██║ ╚████║╚██████╔╝
# ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ 
                                                                                              
speaker 'Great, your environment has been established...'

echo "MINIKUBE_IP $MINIKUBE_IP"

echo ''

. $TRANSMUTE_REPO/setup/1.install_kong.sh

echo 'Now ready to configure SSL...'

# #  ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗     ███████╗███████╗██╗     
# # ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝     ██╔════╝██╔════╝██║     
# # ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗    ███████╗███████╗██║     
# # ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║    ╚════██║╚════██║██║     
# # ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝    ███████║███████║███████╗
# #  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝     ╚══════╝╚══════╝╚══════╝
                                                                           

# . ./setup/2.ngrok_kong_ssl.sh

echo 'Now ready to install IPFS...'

read -p "Press enter to continue" answer


# ██╗███╗   ██╗███████╗████████╗ █████╗ ██╗     ██╗         ██╗██████╗ ███████╗███████╗
# ██║████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██║     ██║         ██║██╔══██╗██╔════╝██╔════╝
# ██║██╔██╗ ██║███████╗   ██║   ███████║██║     ██║         ██║██████╔╝█████╗  ███████╗
# ██║██║╚██╗██║╚════██║   ██║   ██╔══██║██║     ██║         ██║██╔═══╝ ██╔══╝  ╚════██║
# ██║██║ ╚████║███████║   ██║   ██║  ██║███████╗███████╗    ██║██║     ██║     ███████║
# ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝╚═╝     ╚═╝     ╚══════╝
                                                                                     
. $TRANSMUTE_REPO/setup/3.install_ipfs.sh


# ██╗███╗   ██╗███████╗████████╗ █████╗ ██╗     ██╗          ██████╗  █████╗ ███╗   ██╗ █████╗  ██████╗██╗  ██╗███████╗
# ██║████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██║     ██║         ██╔════╝ ██╔══██╗████╗  ██║██╔══██╗██╔════╝██║  ██║██╔════╝
# ██║██╔██╗ ██║███████╗   ██║   ███████║██║     ██║         ██║  ███╗███████║██╔██╗ ██║███████║██║     ███████║█████╗  
# ██║██║╚██╗██║╚════██║   ██║   ██╔══██║██║     ██║         ██║   ██║██╔══██║██║╚██╗██║██╔══██║██║     ██╔══██║██╔══╝  
# ██║██║ ╚████║███████║   ██║   ██║  ██║███████╗███████╗    ╚██████╔╝██║  ██║██║ ╚████║██║  ██║╚██████╗██║  ██║███████╗
# ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝
                                                                                                                     
. $TRANSMUTE_REPO/setup/4.install_ganache.sh

speaker "Would you like to update your hosts file automatically?"
read -p '[yn]' answer
if [ "$answer" = y ] ; then
  . ./scripts/configure-hosts.sh
fi

if [ "$answer" = n ] ; then
  speaker "Make sure to update your /etc/hosts file, before proceeding."
  speaker "It should look like this:"
  echo '192.168.99.100  transmute.minikube'
  echo '192.168.99.100  ipfs.transmute.minikube'
  echo '192.168.99.100  ganache.transmute.minikube'
fi
