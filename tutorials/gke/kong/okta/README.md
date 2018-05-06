Assuming you have setup kong and ipfs or some other service correctly.


### Connect to the Admin API

```
export KONG_ADMIN_POD=$(kubectl get pods --namespace alpha -l "app=kong,release=gateway"  -o jsonpath="{.items[0].metadata.name}")

kubectl port-forward -n alpha $KONG_ADMIN_POD 8444:8444

curl -k -X GET \
  --url https://localhost:8444/apis

```

### Secure IPFS with JWT Plugin

```
curl -k -X POST \
  --url https://localhost:8444/apis/ipfs/plugins \
    --data "name=jwt"
```


### Configure Okta - Kong

Create an API consumer:

```
curl -k -X POST \
  --url https://localhost:8444/consumers \
  --data "username=bob@example.com" \
  --data "custom_id=0"
```

Grab your signing key from:

`https://YOUR_INSTANCE.oktapreview.com/oauth2/default/v1/keys`

You will need to convert the signing key to pem format:

```
const fs = require('fs');
const jwkToPem = require('jwk-to-pem');
const writeFile = (filepath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, data, 'UTF-8', err => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};
(async () => {
  const response = require('./okta-signing-keys.json');
  const pem = jwkToPem(response.keys[0]);
  await writeFile('./okta.pem', pem);
})();
```

Get your consumer id:

```
curl -k -X GET \
  --url https://localhost:8444/consumers
```

Configure Kong to accept Okta JWTs for this consumer:

```
curl -k -X POST \
  --url https://localhost:8444/consumers/CONSUMER_ID/jwt \
  -F "algorithm=RS256" \
  -F "rsa_public_key=@./okta.pem" \
  -F "key=https://YOUR_INSTANCE.oktapreview.com/oauth2/default"
```