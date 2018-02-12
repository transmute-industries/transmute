# Transmute

A Blockchain framework for Identity and Compliance.

🚧 Pardon our mess as we upgrade to support kubernetes. 🚧

🔥 DO NOT USE IN PRODUCTION 🔥

### The transmute framework is a library for connecting off-chain data with on-chain smart contracts.

This implementation is not optimized for cost, but for rapid prototyping. The framework is meant for developing proof of concepts quickly, and not currently ready for production use.

With the framework come tutorials for managing ethereum depenencies with kubernetes locally or with cloud providers.

### Getting started

#### Note: Use npm with this project, yarn does not play nicely with our lerna setup.

* [Setup Minikube](https://github.com/transmute-industries/transmute/tree/master/demos/minikube-setup)
* [Setup IPFS](https://github.com/transmute-industries/transmute/tree/master/demos/minikube-setup/ipfs)
* [Setup Ganache-CLI](https://github.com/transmute-industries/transmute/tree/master/demos/minikube-setup/ganache-cli)

We can use lerna and k8s services to configure the smart contracts:

```
export GANACHE_CLI=$(minikube --namespace transmute-testrpc  service transmute-testrpc-ganache-cli --url )
export IPFS_GATEWAY=$(minikube service --url ipfs-gateway --namespace transmute-ipfs)
export IPFS_API=$(minikube service --url ipfs-api --namespace transmute-ipfs)

npm install -g lerna
git clone https://github.com/transmute-industries/transmute.git
lerna bootstrap
lerna run build --ignore transmute-alpha --ignore transmute-framework
lerna run prep --scope transmute-compliance-demo
```

### Compliance

Many compliance use cases involve linking off-chain data to on-chain smart contracts, which can provide an immutable audit log. Such transactions are expensive, but with the transmute framework some cost can be saved through off chain storage, via a hopefully familar redux interface.

In this tutorial, we'll show you how to write events to ethereum smart contracts, and how ReadModels represent the state of a smart contract as it processes each event. ReadModels can be saved to databases and queried over time, and are an interface for off chain services.

You'll learn:

* How to create an eventstore contract.
* How to save an event with an adapter.
* How to use a ReadModel to get a smart contracts state.

To get started, navigate to the `transmute-compliance-demo` directory.

```
cd packages/transmute-compliance-demo
```

Follow the instructions in the [Compliance Demo Read Me](./packages/transmute-compliance-demo)
