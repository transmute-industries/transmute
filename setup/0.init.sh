
# http://patorjk.com/software/taag/#p=display&f=ANSI%20Shadow

export WELCOME='Welcome to transmute, this guide will help you setup your environment. Before we get started, be sure to update your transmute-config.'

echo $WELCOME
say $WELCOME

# ███████╗███████╗████████╗██╗   ██╗██████╗      ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗ 
# ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗    ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ 
# ███████╗█████╗     ██║   ██║   ██║██████╔╝    ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
# ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝     ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
# ███████║███████╗   ██║   ╚██████╔╝██║         ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
# ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝          ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝ 
                                                                                             
echo 'Transmute Config can be found here:\n'

echo ' - ./transmute-config/.env'
echo ' - ./transmute-config/env.json'

echo ''

read -p "Press enter to continue"

. ./transmute-config/.env

# ██╗███╗   ██╗███████╗████████╗ █████╗ ██╗     ██╗         ██╗  ██╗ ██████╗ ███╗   ██╗ ██████╗ 
# ██║████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██║     ██║         ██║ ██╔╝██╔═══██╗████╗  ██║██╔════╝ 
# ██║██╔██╗ ██║███████╗   ██║   ███████║██║     ██║         █████╔╝ ██║   ██║██╔██╗ ██║██║  ███╗
# ██║██║╚██╗██║╚════██║   ██║   ██╔══██║██║     ██║         ██╔═██╗ ██║   ██║██║╚██╗██║██║   ██║
# ██║██║ ╚████║███████║   ██║   ██║  ██║███████╗███████╗    ██║  ██╗╚██████╔╝██║ ╚████║╚██████╔╝
# ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ 
                                                                                              
say 'Great, your environment has been established...\!'

echo 'MINIKUBE_IP ' $MINIKUBE_IP

echo ''

./setup/1.install_kong.sh

echo 'Now ready to configure SSL...'

#  ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗     ███████╗███████╗██╗     
# ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝     ██╔════╝██╔════╝██║     
# ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗    ███████╗███████╗██║     
# ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║    ╚════██║╚════██║██║     
# ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝    ███████║███████║███████╗
#  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝     ╚══════╝╚══════╝╚══════╝
                                                                           
echo 'Edit and run ./setup/2.0.ngrok_kong_ssl.sh'

read -p "Press enter to continue"

./setup/2.1.ngrok_kong_ssl.sh

echo 'Now ready to install IPFS...'

read -p "Press enter to continue"


# ██╗███╗   ██╗███████╗████████╗ █████╗ ██╗     ██╗         ██╗██████╗ ███████╗███████╗
# ██║████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██║     ██║         ██║██╔══██╗██╔════╝██╔════╝
# ██║██╔██╗ ██║███████╗   ██║   ███████║██║     ██║         ██║██████╔╝█████╗  ███████╗
# ██║██║╚██╗██║╚════██║   ██║   ██╔══██║██║     ██║         ██║██╔═══╝ ██╔══╝  ╚════██║
# ██║██║ ╚████║███████║   ██║   ██║  ██║███████╗███████╗    ██║██║     ██║     ███████║
# ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝╚═╝     ╚═╝     ╚══════╝
                                                                                     
./setup/3.install_ipfs.sh

