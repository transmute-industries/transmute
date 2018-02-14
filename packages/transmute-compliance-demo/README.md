# Transmute Compliance Demo

### Make sure that you have reviewed 'Getting Started' section of the [root README](https://github.com/transmute-industries/transmute) prior to continuing.

## Getting Started

For now, you will need to clone the mono repo and use lerna to run this demo.

In the future, you will be able to run this demo from public testnet and hosted services.

Install lerna globally: `npm i lerna -g`.

Before we get started, we'll want to make sure Ganache CLI, and IPFS are running.

Either follow the minikube instructions, or run `docker-compose up` from the root directory.

Next, we'll need to deploy some smart contracts to ganache-cli and link them to the transmute framework.

Normally, you would do this as a build step in your own project, or link against contracts deployed on the public test net. For this demo to work, you will need to make sure the contracts used by the framework are deployed to ganache-cli:

```
npm run prep
```

Start the demo:

```
npm run demo
```
