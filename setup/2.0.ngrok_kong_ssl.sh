
# example ngrok config

# authtoken: TOKEN
# tunnels:
#   certbot:
#     addr: 80
#     proto: http
#     hostname: you.example.com


# first start ngrok
# ngrok start --all

# next run certbot
# sudo certbot certonly

# if successfull
# your cert will should be in  /etc/letsencrypt/live/

# update your hosts file to support kong 
# echo "$(minikube ip)  you.example.com" | sudo tee -a /etc/hosts
