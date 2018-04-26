#!/bin/sh
: ${USE_VOX:=y}

# http://patorjk.com/software/taag/#p=display&f=ANSI%20Shadow

speaker () {
  WELCOME=$1
  echo $WELCOME
  if [ "$USE_VOX" = y ]; then
    if type "say"        > /dev/null 2> /dev/null; then
      say "$WELCOME"
    elif type "espeak"   > /dev/null 2> /dev/null; then
      espeak "$WELCOME"  > /dev/null 2> /dev/null
    elif type "spd-say"  > /dev/null 2> /dev/null; then
      spd-say "$WELCOME" > /dev/null 2> /dev/null
    elif type "festival" > /dev/null 2> /dev/null; then
      echo "$WELCOME" | festival --tts > /dev/null 2> /dev/null
    fi
  fi
}

bail () {
  speaker "then I am bailing out, you will need to create the environment file at  ./transmute-config/.env" answer
  exit 1
}


speaker 'Welcome to transmute'
speaker 'Before we get started, do you mind if I continue speaking?'
speaker 'enter y or n'
read -p '[yn]' USE_VOX
export USE_VOX=$USE_VOX
speaker 'This guide will help you setup your environment.'
speaker 'let me check your transmute-config.'


# ███████╗███████╗████████╗██╗   ██╗██████╗      ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗ 
# ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗    ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ 
# ███████╗█████╗     ██║   ██║   ██║██████╔╝    ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
# ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝     ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
# ███████║███████╗   ██║   ╚██████╔╝██║         ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
# ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝          ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝ 
                                                                                             

if [ -e "./transmute-config/.env" ]; then
  speaker 'Transmute Config has been found here ./transmute-config/.env'
else
  speaker "Would you like me to copy the example environment file?"
  read -p '[yn]' answer
  if [ "$answer" = y ] ; then
    # run the command
    speaker "ok, I will copy the example environment file to transmute-config/.env"
    cp ./transmute-config/.example.env  ./transmute-config/.env
  else
    bail
  fi
fi

speaker "Would you like to edit the environment file?"
read -p '[yn]' answer
if [ "$answer" = y ] ; then
  if [ ! -z "$EDITOR" ] ; then
    $EDITOR ./transmute-config/.env
  else
    speaker "You will need to set your EDITOR environment variable"
    exit 1
  fi
fi

if [ -e "./transmute-config/.env" ]; then
  speaker "Press enter to continue if you are satisfied with transmute-config/.env" &
  read -p ' ' answer
else
  bail
fi

. ./transmute-config/.env

# ██╗███╗   ██╗███████╗████████╗ █████╗ ██╗     ██╗         ██╗  ██╗ ██████╗ ███╗   ██╗ ██████╗ 
# ██║████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██║     ██║         ██║ ██╔╝██╔═══██╗████╗  ██║██╔════╝ 
# ██║██╔██╗ ██║███████╗   ██║   ███████║██║     ██║         █████╔╝ ██║   ██║██╔██╗ ██║██║  ███╗
# ██║██║╚██╗██║╚════██║   ██║   ██╔══██║██║     ██║         ██╔═██╗ ██║   ██║██║╚██╗██║██║   ██║
# ██║██║ ╚████║███████║   ██║   ██║  ██║███████╗███████╗    ██║  ██╗╚██████╔╝██║ ╚████║╚██████╔╝
# ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ 
                                                                                              
speaker 'Great, your environment has been established...\!'

echo "MINIKUBE_IP $MINIKUBE_IP"

echo ''

. ./setup/1.install_kong.sh

echo 'Now ready to configure SSL...'

#  ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗     ███████╗███████╗██╗     
# ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝     ██╔════╝██╔════╝██║     
# ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗    ███████╗███████╗██║     
# ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║    ╚════██║╚════██║██║     
# ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝    ███████║███████║███████╗
#  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝     ╚══════╝╚══════╝╚══════╝
                                                                           

. ./setup/2.ngrok_kong_ssl.sh

echo 'Now ready to install IPFS...'

read -p "Press enter to continue" answer


# ██╗███╗   ██╗███████╗████████╗ █████╗ ██╗     ██╗         ██╗██████╗ ███████╗███████╗
# ██║████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██║     ██║         ██║██╔══██╗██╔════╝██╔════╝
# ██║██╔██╗ ██║███████╗   ██║   ███████║██║     ██║         ██║██████╔╝█████╗  ███████╗
# ██║██║╚██╗██║╚════██║   ██║   ██╔══██║██║     ██║         ██║██╔═══╝ ██╔══╝  ╚════██║
# ██║██║ ╚████║███████║   ██║   ██║  ██║███████╗███████╗    ██║██║     ██║     ███████║
# ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝╚═╝     ╚═╝     ╚══════╝
                                                                                     
. ./setup/3.install_ipfs.sh


# ██╗███╗   ██╗███████╗████████╗ █████╗ ██╗     ██╗          ██████╗  █████╗ ███╗   ██╗ █████╗  ██████╗██╗  ██╗███████╗
# ██║████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██║     ██║         ██╔════╝ ██╔══██╗████╗  ██║██╔══██╗██╔════╝██║  ██║██╔════╝
# ██║██╔██╗ ██║███████╗   ██║   ███████║██║     ██║         ██║  ███╗███████║██╔██╗ ██║███████║██║     ███████║█████╗  
# ██║██║╚██╗██║╚════██║   ██║   ██╔══██║██║     ██║         ██║   ██║██╔══██║██║╚██╗██║██╔══██║██║     ██╔══██║██╔══╝  
# ██║██║ ╚████║███████║   ██║   ██║  ██║███████╗███████╗    ╚██████╔╝██║  ██║██║ ╚████║██║  ██║╚██████╗██║  ██║███████╗
# ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝
                                                                                                                     
. ./setup/4.install_ganache.sh
