# Gettings an SSL Cert for ngrok

- https://certbot.eff.org/lets-encrypt

## Setup ngrok

Go here: https://dashboard.ngrok.com/reserved#

Reserve:
- you.example.com

First configure ngrok:

```
authtoken: TOKEN
tunnels:
  certbot:
    addr: 80
    proto: http
    hostname: you.example.com
```

Start ngrok:

```
ngrok start --all
```

### Install Certbot

```
brew install certbot
sudo certbot certonly
```

Select 2 option, follow the instructions to retrieve you cert.

When its time to renew, make sure ngrok is running and run:

```
sudo certbot renew --dry-run
sudo certbot renew
```

### Securing Your Cert

```
curl -k -i -X POST $KONG_ADMIN_URL/certificates \
    -F "cert=@/etc/letsencrypt/live/you.example.com/fullchain.pem" \
    -F "key=@/etc/letsencrypt/live/ou.example.com/privkey.pem" \
    -F "snis=you.example.com"
```

You will need to allow ngrok to access your cert, doing so will likely risk the cert being stolen.

Please open a PR if you have a better proposal for this step.

We recommend copying to things to a directory with restricted access:

```
sudo cp /etc/letsencrypt/live/you.example.com/fullchain.pem ~/unsafe/
sudo cp /etc/letsencrypt/live/you.example.com/privkey.pem ~/unsafe/
```

### Configure ngrok to use the cert

Assuming you are in this directory: transmute/tutorials/minikube/ngrok/lets-encrypt

Start a simple web server for testing.

```
serve .
```

Now configure ngrok to tunnel to this server:

```
authtoken: TOKEN
tunnels:
  # certbot:
  #   addr: 80
  #   proto: http
  #   hostname: you.example.com
  test:
    addr: 5000
    proto: tls
    key: /Users/you/unsafe/privkey.pem
    crt: /Users/you/unsafe/fullchain.pem
    hostname: you.example.com
```

Restart ngrok:

```
ngrok start --all
```

You should now be able to securly access you tunnel:

https://you.example.com

