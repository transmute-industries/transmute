
# [Transmute](https://transmute.industries) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/transmute-industries/transmute/blob/master/LICENSE) [![codecov](https://codecov.io/gh/transmute-industries/transmute/branch/master/graph/badge.svg)](https://codecov.io/gh/transmute-industries/transmute) [![Build Status](https://travis-ci.org/transmute-industries/transmute.svg?branch=master)](https://travis-ci.org/transmute-industries/transmute)

<p align="center">
  <img src="./transmute-banner.png"/>
</p>

Transmute is an enterprise-grade framework for building secure and scalable decentralized applications.

Main Features:
* Public or private decentralized services hosted in Kubernetes and secured behind Kong
* Seamless persistence of redux state to secured and private resources and an event-sourced smart contract system.
* Easy environment management and configuration for public and private networks.

Transmute currently integrates with EVM blockchains (Ethereum), Decentralized Storage (IPFS), Centralized Storage (Postgres), Identity Providers (Okta), API Gateway (Kong), and existing cloud hosting (Google Kubernetes Engine, Azure Kubernetes Service and Minikube).

### Manual Installation

See the [longer form docs](./docs/README.md), and [tutorials](./tutorials) section.

## Using Lerna and the mono repo

These instructions are only necessary if you are contributing to the mono repo. If you are just using the cli to spin up and manage k8s clusters or one of the other packages in this mono repo, you can skip these steps.

In order to connect to services running in your cluster, you will need to update your transmute-config. The mono repo contains a web dashboard which can be used to test your services. Make sure to update `transmute-config/env.json` before attempting to use lerna to build the project. 

Final steps - linking everything and migrating your smart contracts

1. Navigate to the root directory
1. Run `npm i && lerna bootstrap`
1. Run `lerna run --scope transmute-framework truffle:test`
1. Run `lerna run --scope transmute-framework truffle:migrate`
1. Run `lerna run --scope transmute-framework test`
1. Navigate to the `/packages/transmute-dashboard/` directory
1. Run `npm run truffle:migrate`
1. Run `npm run start`

That's it! [Login to the app](http://localhost:3000) and click on the dashboard button in the side menu to begin recording events!
