
### Getting Started

Assuming you have minikube with kong and a service all setup....


### Add JWT support to IPFS API
```
curl -k -X POST https://192.168.99.100:32444/apis/ipfs/plugins --data "name=jwt"
```

### Expect Rejection

```
curl -k GET https://ipfs.transmute.network:32443/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme
```

### Get Cert

```
curl -o YOUR_COMPANY.pem https://YOUR_COMPANY.auth0.com/pem
keytool -printcert -file YOUR_COMPANY.pem
openssl x509 -pubkey -noout -in YOUR_COMPANY.pem > pubkey.pem
```

### Setup a consumer... 

https://192.168.99.100:32444/consumers

```
$ curl -i -X POST http://kong:8001/consumers \
    --data "username=<USERNAME>" \
    --data "custom_id=<CUSTOM_ID>"

$ curl -i -X POST http://localhost:8001/consumers/{consumer}/jwt \
    -F "algorithm=RS256" \
    -F "rsa_public_key=@./pubkey.pem" \
    -F "key=https://{COMPAYNAME}.auth0.com/" # the `iss` field
```

```
curl -k -i -X POST https://192.168.99.100:32444/consumers/208fe57f-bd5a-4558-a156-c25c381164a9/jwt \
    -F "algorithm=RS256" \
    -F "rsa_public_key=@./pubkey.pem" \
    -F "key=https://YOUR_COMPANY.auth0.com/" 
```
