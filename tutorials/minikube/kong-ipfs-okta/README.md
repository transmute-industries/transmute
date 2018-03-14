# Securing IPFS in K8s with Kong and Okta

Before getting started, you will need to install minikube:

- [Install Minikube](https://kubernetes.io/docs/getting-started-guides/minikube/)

Next, you will need to install helm:

- [Install Helm](https://github.com/kubernetes/helm/blob/master/docs/install.md)

Once helm is installed, its time to use it to install IPFS and Kong

```
helm install stable/ipfs --name ipfs-mini
helm install stable/kong --name kong-mini
```

Next, make sure to get the IP address of minikube.

```
minikube ip
```

The rest of this tutorial assumes the minikube ip address is `192.168.99.100`.

Add the minkube ip to `/etc/hosts`, this is important to ensure that network requests will include the correct Host header, which Kong will use to route your requests to the correct api inside the cluster.

```
echo "$(minikube ip) ipfs.transmute.minikube" | sudo tee -a /etc/hosts
```

Now we can configure Kong to secure IPFS. First, use `kubectl` to get the `ClusterIP` of IPFS.

```
kubectl get services
```

The rest of this tutorial assumes the `ClusterIP` of ipfs is `10.107.89.122`.

Now lets add the ipfs api to kong:

```
curl -k -X POST \
  --url https://192.168.99.100:32444/apis/ \
  --data 'name=ipfs' \
  --data 'hosts=ipfs.transmute.minikube' \
  --data 'upstream_url=http://10.107.89.122:5001/'
```

Note that `-k` option  is used to avoid errors from the self signed cert used by Kong.

Confirm that Kong is connected to IPFS correctly:

```
curl -k --url https://ipfs.transmute.minikube:32443/api/v0/id
```

Now we can secure IPFS with Okta, by using the jwt plugin.

```
curl -k -X POST https://192.168.99.100:32444/apis/ipfs/plugins \
    --data "name=jwt"
```

Now, confirm IPFS is protected, this request should result in `{"message":"Unauthorized"}`:

```
curl -k --url https://ipfs.transmute.minikube:32443/api/v0/id
```

We'll be following a slightly modified version of this tutorial:

- https://getkong.org/plugins/jwt/#using-the-jwt-plugin-with-auth0

Once, you have setup a developer account with Okta, you can view your authorization server:

`https://<YOUR_VALUE>.oktapreview.com/oauth2/default/.well-known/oauth-authorization-server`

You can retrieve the signing key used by visiting:

`https://<YOUR_VALUE>.oktapreview.com/oauth2/default/v1/keys`

Use this tool or similar to convert the jwk to pem format:

- https://github.com/Brightspace/node-jwk-to-pem

We assume you create a file called `okta.pem` using the tool above and the signing key from okta.

* Make sure to turn off key rotation, or this integration will start to fail when Okta rotates signing keys.

Create an api consumer in Kong:

```
curl -i -X POST https://192.168.99.100:32444/consumers \
    --data "username=<USERNAME>" \
    --data "custom_id=<CUSTOM_ID>"
```

Configure kong to accept Okta JWTs for this consumer:

```
curl -k -X POST https://192.168.99.100:32444/consumers/{consumer_id}/jwt \
    -F "algorithm=RS256" \
    -F "rsa_public_key=@./okta.pem" \
    -F "key=https://<YOUR_VALUE>.oktapreview.com/oauth2/default"
```

There are a number of ways you can get a Okta issued JWT for use with Kong:

- [Command Line App](https://developer.okta.com/authentication-guide/implementing-authentication/auth-code-pkce)
- [React Single Page App](https://developer.okta.com/blog/2017/03/30/react-okta-sign-in-widget)

Now use your okta issued jwt to access IPFS via kong!

```
curl -k --url https://ipfs.transmute.minikube:32443/api/v0/id \
    --header 'Authorization: Bearer <access_token>'
```

If everything was setup correctly, you should see the id of your ipfs node.

Now that we are authenticated, we can add files (increase storage costs):

```
curl -k -F "data=@./example.json" https://ipfs.transmute.minikube:32443/api/v0/add \
  --header 'Authorization: Bearer <access_token>'

# {"Name":"example.json","Hash":"QmSy81WPaR8boDDJ22RHTnpk9jPXVfsdXALDsBthznLYNs"}
```

And retrieve your json file:

`https://ipfs.transmute.minikube:32443/api/v0/cat/QmSy81WPaR8boDDJ22RHTnpk9jPXVfsdXALDsBthznLYNs?jwt=<access_token>`