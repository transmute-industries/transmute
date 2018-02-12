# Transmute Compliance Demo

## You will need:

* [Latest Node.js](https://nodejs.org/)
* [Docker](https://www.docker.com/)

## Getting Started

For now, you will need to clone the mono repo and use lerna to run this demo.

In the future, you will be able to run this demo from public testnet and hosted services.

Install lerna globally: `npm i lerna -g`.

Start docker from the root directory of this repo: 

```
docker-compose up
```


Before we get started, we'll need to deploy some smart contracts and link them to the transmute framework.

Normally, you would do this as a build step in your own project.

```
npm run prep
```

Start the demo:

```
npm run demo
```
