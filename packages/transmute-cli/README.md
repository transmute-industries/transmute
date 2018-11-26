# Transmute CLI

A command line tool for managing Transmute services in minikube, as soon azure, and google. This will assist in the provisioning and initialization of the cluster, and other maintenance tasks.

- [Docs](https://docs.transmute.industries/transmute-cli/1.0.0/)

Setup
=====

First step is to install the development dependencies. Review this bootstrap script before running it:

```
curl -Ls https://git.io/transmute_bootstrap > transmute_bootstrap
chmod +x transmute_bootstrap
./transmute_bootstrap
# cleanup 
rm -rf ./transmute_bootstrap
```

Or if you like to live dangerously...

```
source <(curl -Ls https://git.io/transmute_bootstrap)
```

Once the bootstrap has succeeded, you should have the transmute cli installed globally.

```
transmute version
```

You can use the transmute cli to provision and initialize a development cluster. The cli will setup minikube, install ipfs, an ethereum testnet and kong, and configure them. It will also modify your hosts files, so you can easily access these services:

```
transmute k8s provision-minikube my-cluster
transmute k8s init my-cluster
transmute k8s microservice install kong
transmute k8s microservice install ganache
transmute k8s microservice install ipfs
```

Once this process has completed, you should be able to talk to ganache and ipfs through kong via curl (note the kong port will need to be updated, `kubectl get svc`):


Get ganache web3 client version:

```
curl -s -k -X POST \
  --url "https://ganache.transmute.minikube:$KONG_PROXY_PORT/ganache" \
  --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":68}' \
  | jq -r '.'
```

Get ipfs node id:

```
curl -s -k -X GET \
  --url 'https://ipfs.transmute.minikube:'$KONG_PROXY_PORT'/api/v0/id' \
  | jq '.'
```

### Gotchas

- [minikube requires root when running with vm-driver = none.](https://blog.travis-ci.com/2017-10-26-running-kubernetes-on-travis-ci-with-minikube) 



```
npm i
npm run transmute
npm run transmute help
```

### telemetry

`transmute telemetry <on|off>`

This will turn on or off telemetry sending to mixpanel.

To override the mixpanel project id, you can set the env variable `MIXPANEL_PROJECT_ID`.

### login

`$ transmute login`

This will use PKCE to login with okta. A JWT will be stored here:

`~/.transmute/cli-secrets/session.json`

This is for use with the centralized Transmute API.

### generate-keys

`$ transmute generate-keys`

This will generate a primary and recovery keypair that will be stored in your local GPG keyring.

These keys will be used for registration with the centralized Transmute API.

### generate-recovery-key

`$ transmute generate-recovery-key`

This will generate a new recovery key and sign your previous recovery key with it and store them in your local GPG keyring.

These keys will be used for performing recovery with the centralized Transmute API.

### list-keys

`$ transmute list-keys`

This will list all the keys in your local GPG keyring.

### export-private-key

`$ transmute export-private-key`

This will log the private key for the specified keypair a user has on their machine.

This private key can be used to import your account into other systems (Ex: Metamask).

### provision-minikube

`transmute k8s provision-minikube mytransmutek8s` <-- will create a
k8s cluster using minikube by default it will use minikube, but you can
choose the driver by passing a `--vmdriver=` option on the command line
e.g.

```
$ transmute k8s provision-minikube mytransmutek8s 
```

### provision-azure

```
$ transmute k8s provision-azure mytransmutek8s myGroup
```

will create a k8s cluster using azure by default.

#### init

```
$ transmute k8s init mytransmutek8s
```

This will prepare your cluster with the base Transmute k8s deployment.


