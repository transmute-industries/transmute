# Transmute CLI

A command line tool for managing transmute services in minikube, as soon azure, and google. This will assist in the provisioning and initialization of the cluster, and other maintenance tasks.

- [Docs](https://docs.transmute.industries/transmute-cli/1.0.0/)


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

`transmute login`

This will use PKCE to login with okta. A JWT will be stored here:

`~/.transmute/cli-secrets/session.json`

This is for use with the centralized transmute API.

### provision-minikube

`transmute k8s provision-minikube mytransmutek8s` <-- will create a
k8s cluster using minikube by default it will use minikube, but you can
choose the driver by passing a `--vmdriver=` option on the command line
e.g.

`transmute k8s provision-minikube mytransmutek8s --vmdriver=none`

### provision-azure

`transmute k8s provision-azure mytransmutek8s myGroup` <-- will create a
k8s cluster using azure by default.

#### init

`transmute k8s init mytransmutek8s`

This will prepare your cluster with the base transmute k8s deployment.


