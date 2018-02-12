# Transmute Compliance Demo

### Make sure that you have reviewed 'Getting Started' section of the [root README](https://github.com/transmute-industries/transmute) prior to continuing.

## Getting Started

For now, you will need to clone the mono repo and use lerna to run this demo.

In the future, you will be able to run this demo from public testnet and hosted services.

Install lerna globally: `npm i lerna -g`.

Before we get started, we'll want to setup Minikube, Ganache CLI, and IPFS.

- [Setting up minikube](https://github.com/transmute-industries/transmute/blob/master/tutorials/minikube/README.md)
- [Setting up ganache cli](https://github.com/transmute-industries/transmute/blob/master/tutorials/minikube/ganache-cli/README.md)
- [Setting up ipfs](https://github.com/transmute-industries/transmute/tree/master/tutorials/minikube/ipfs/README.md)

Next, we'll need to deploy some smart contracts and link them to the transmute framework.

Normally, you would do this as a build step in your own project.

```
npm run prep
```

Start the demo:

```
npm run demo
```
