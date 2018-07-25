# [Transmute](https://transmute.industries) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/transmute-industries/transmute/blob/master/LICENSE) [![codecov](https://codecov.io/gh/transmute-industries/transmute/branch/master/graph/badge.svg)](https://codecov.io/gh/transmute-industries/transmute) [![Build Status](https://travis-ci.org/transmute-industries/transmute.svg?branch=master)](https://travis-ci.org/transmute-industries/transmute)

Transmute is an enterprise-grade framework for building secure and scalable decentralized applications.

Main Features:

* Public or private decentralized services hosted in Kubernetes and secured behind Kong with JWTs issued by trusted identity providers (Okta)
* Seamless persistence of redux state to secured and private resources and an event-sourced smart contract system.
* Easy environment management and configuration for public and private networks.

Transmute currently integrates with EVM blockchains (Ethereum), Decentralized Storage (IPFS), Centralized Storage (Postgres), Identity Providers (Okta), API Gateway (Kong), and existing cloud hosting (Google Kubernetes Engine).

Setup
=====
This guide will walk you through getting setup with Transmute.

Here is a [video](https://drive.google.com/open?id=1ETHBCGyHYahiK-97fRE4-MAebbcp_N8n) to help guide you along.

### Oneliner

```
curl -Ls https://git.io/transmute_bootstrap | bash
```

Notice that will install kubectl, minikube, helm, ansible, and ngrok for you, if
any of these things are already present on your path then they will be
skipped.  If you find one of these components are out of date, delete it
from your path and rerun the oneliner. Check [Oneliner internals](https://github.com/transmute-industries/transmute/docs/ansible.md) for details and setup troubleshooting.

Now you can proceed to the
[Environment scripts and updating](https://github.com/transmute-industries/transmute#environment-scripts-and-updating)
section and continue.

Or alternately you can install manually...

## Manual Installation

### Minikube and Helm
1. Minikube is a tool that makes it easy to run Kubernetes locally. Minikube runs a single-node Kubernetes cluster inside a VM on your laptop. [Install Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)
2. Helm is a tool for managing Kubernetes charts. Charts are packages of pre-configured Kubernetes resources. [Install Helm](https://github.com/kubernetes/helm/blob/master/docs/install.md)
3. Run `$ minikube version` to ensure minikube has been installed properly
4. Run `$ minikube start` to start your local kubernetes cluster
5. Run `$ helm version` to ensure helm has been installed properly

### Custom Domain
In order to secure resources with SSL, you will need a custom domain. You can reserve one with [Google Domains](domains.google.com) or similar domain registration services.

### Ngrok
We use ngrok to provide a secure url for localhost development for connecting to secured resources (IPFS, Ethereum).
1. [Sign up](https://dashboard.ngrok.com/user/signup) for an Ngrok Pro account
2. [Configure your custom subdomain](https://ngrok.com/docs#custom-domains)
3. [Download ngrok](https://dashboard.ngrok.com/get-started)
3. Move the executable to your root directory (~/)
4. Create an alias in your `.bash_profile` so that you can run the `ngrok` command from any directory
5. Edit your `~/.ngrok2/ngrok.yml` ([Default Ngrok Configuration](https://ngrok.com/docs#config-location))
```YAML
authtoken: $YOUR_AUTH_TOKEN
tunnels:
  certbot:
    addr: 80
    proto: http
    hostname: $YOUR_CUSTOM_SUBDOMAIN
  # kong:
  #   addr: $KONG_URL_AND_PORT
  #   proto: tls
  #   bind_tls: true
  #   hostname: $YOUR_CUSTOM_SUBDOMAIN
```
6. Update `transmute-config/.example.env` with:
    * `KONG_NGROK_HOST` will map to $YOUR_CUSTOM_SUBDOMAIN (Ex: dev.example.com)
7. Update your hosts file to map $YOUR_CUSTOM_SUBDOMAIN to your minikube ip
    * `echo "$(minikube ip)  $YOUR_CUSTOM_SUBDOMAIN" | sudo tee -a /etc/hosts`

### Certbot
Cerbot allows us to create SSl certificates with letsencrypt for our subdomain.
1. [Install certbot](https://certbot.eff.org/docs/install.html#system-requirements)
2. Start ngrok `ngrok start --all`
3. With ngrok running and pointing to your custom subdomain, run `sudo certbot certonly` - you will want to:
    * Select '2: Spin up a temporary webserver (standalone)'
    * Enter $YOUR_CUSTOM_SUBDOMAIN for domain name(s)
4. Stop the ngrok process you started in step 2
5. If successful, your cert should be in `/etc/letsencrypt/live/`.

### Okta
1. [Sign Up](https://developer.okta.com/signup/)
2. [Add an OpenID Connect Client in Okta](https://developer.okta.com/quickstart/#/react/nodejs/generic) __Make sure to use port 3000 and not 8080 for these URIs__ - This will be for authenticating users on your frontend.
3. Use the "Configuration" section and information about your application in Okta to update the values in `packages/transmute-dashboard/src/Components/Routes/index.js`
4. Add a native application (Applications -> add application) - this will be for testing the issuance of JWTs during setup.
    * For "Allowed grant types", choose "Authorization Code", "Refresh Token", and "Resource Owner Password".
    * Click "Done"
    * Scroll down to "Client Credentials" and click "Edit"
    * Select "Use Client Authentication" and click "Save"
5. Add a user (Users -> People -> Add Person). Set their password as admin and __uncheck__ the box for them to reset their password on first login.
6. Update `transmute-config/.example.env` with:
    * `OKTA_HOSTNAME` that was given to you on signup __Do not include https__ (Ex: dev-280930.oktapreview.com)
    * `OKTA_CLIENT_ID` and `OKTA_CLIENT_SECRET` given to you in step 4
    * `OKTA_USERNAME` and `OKTA_PASSWORD` that you assigned to your user in step 5
    * `KONG_CONSUMER_USERNAME` with the username that you assigned in step 5

### JQ
* Follow [these instructions](https://stedolan.github.io/jq/download)

### Environment Scripts and Updating
1. Rename `/transmute-config/.example.env` to `/transmute-config/.env`
2. Run `npm i`
3. Ensure you have minikube running
4. Run `npm run setup`

At the end of this process, you should see the following variables listed in the terminal:
* Kong Ngrok proxy URL `KONG_NGROK_PROXY_URL`
* Kong Ngrok Host URL `KONG_NGROK_HOST`
* Kong proxy port `KONG_PROXY_PORT`

With these we will be updating a few files.
1. Update `/packages/transmute-dashboard/src/transmute-config/env.json` with these values. (`KONG_PROXY_PORT` should not be in quotes, it is a number)
2. Copy `/packages/transmute-dashboard/src/transmute-config/env.json` into `/transmute-config/env.json`
3. Update `$KONG_NGROK_PROXY_URL` in `/packages/transmute-dashboard/src/Components/Settings/index.js`

Final steps - linking everything and migrating your smart contracts
1. Navigate to the root directory
2. Run `lerna bootstrap`
3. Run `lerna run --scope transmute-framework truffle:test`
4. Run `lerna run --scope transmute-framework truffle:migrate`
5. Run `lerna run --scope ipfs-api build`
6. Navigate to the `/packages/transmute-dashboard/` directory
7. Run `npm run truffle:migrate`
8. Run `npm run start`

That's it! Login to the app and click on the dashbaord button in the side menu to begin recording events!

### Command Line Interface

Transmute includes a command line interfce (CLI) tool. This will assist
in the provisioning and initialization of the cluster, and other
maintenance tasks.

## Provision

### provision-minikube

`transmute k8s provision-minikube mytransmutek8s`   <-- will create a
k8s cluster using minikube by default it will use minikube, but you can
choose the driver by passing a `--vmdriver=` option on the command line
e.g.

`transmute k8s provision-minikube mytransmutek8s --vmdriver=none`

### provision-azure

`transmute k8s provision-azure mytransmutek8s myGroup`   <-- will create a
k8s cluster using azure by default.

#### init

`transmute k8s init mytransmutek8s`

This will prepare your cluster with the base transmute k8s deployment.
