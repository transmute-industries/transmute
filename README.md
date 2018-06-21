# [Transmute](https://transmute.industries) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/transmute-industries/transmute/blob/master/LICENSE) [![codecov](https://codecov.io/gh/transmute-industries/transmute/branch/master/graph/badge.svg)](https://codecov.io/gh/transmute-industries/transmute) [![Build Status](https://travis-ci.org/transmute-industries/transmute.svg?branch=master)](https://travis-ci.org/transmute-industries/transmute)

Transmute is an enterprise-grade framework for building secure and scalable decentralized applications.

Main Features:
* Public or private decentralized services hosted in Kubernetes and secured behind Kong
* Seamless persistence of redux state to secured and private resources and an event-sourced smart contract system.
* Easy environment management and configuration for public and private networks.

Transmute currently integrates with EVM blockchains (Ethereum), Decentralized Storage (IPFS), Centralized Storage (Postgres), Identity Providers (Okta), API Gateway (Kong), and existing cloud hosting (Google Kubernetes Engine, Azure Kubernetes Service and Minikube).

Setup
=====

First step is to install the development dependencies. Review this bootstrap script before running it:

```
curl -Ls https://git.io/transmute_bootstrap | bash
```

Once the bootstrap has succeeded, you should have the transmute cli installed globally.

```
transmute version
```

You can use the transmute cli to provision and initialize a development cluster. The cli will setup minikube, install ipfs, an ethereum testnet and kong, and configure them. It will also modify your hosts files, so you can easily access these services:

```
transmute k8s provision-minikube my-cluster
transmute k8s init my-cluster
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

### Manual Installation

See the [longer form docs](./docs/README.md), and [tutorials](./tutorials) section.

## Using Lerna and the mono repo

These instructions are only necessary if you are contributing to the dashboard or framework and testing their integration. If you are just using the cli to spin up and manage the cluster, you can skip these steps.

In order to connect to services running in your cluster, you will need to update your transmute-config. The mono repo contains a web dashboard which can be used to test your services. Make sure to update `transmute-config/env.json` before attempting to use lerna to build the project. 

Final steps - linking everything and migrating your smart contracts

1. Navigate to the root directory
1. Run `lerna bootstrap`
1. Run `lerna run --scope transmute-framework truffle:test`
1. Run `lerna run --scope transmute-framework truffle:migrate`
1. Run `lerna run --scope transmute-framework test`
1. Navigate to the `/packages/transmute-dashboard/` directory
1. Run `npm run truffle:migrate`
1. Run `npm run start`

That's it! [Login to the app](http://localhost:3000) and click on the dashboard button in the side menu to begin recording events!


