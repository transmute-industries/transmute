# Transmute

Open Source Blockchain Development

🚧 Pardon our mess as we upgrade to support kubernetes. 🚧

🔥 DO NOT USE IN PRODUCTION 🔥

[![Build Status](https://travis-ci.org/transmute-industries/transmute.svg?branch=master)](https://travis-ci.org/transmute-industries/transmute)

JavaScript Coverage:

[![codecov](https://codecov.io/gh/transmute-industries/transmute/branch/master/graph/badge.svg)](https://codecov.io/gh/transmute-industries/transmute)

Solidity Coverage:

[![Coverage Status](https://coveralls.io/repos/github/transmute-industries/transmute/badge.svg?branch=feature%2Fokta-ci)](https://coveralls.io/github/transmute-industries/transmute?branch=feature%2Fokta-ci)

We use lerna for code-splitting, learn more [here](https://github.com/lerna/lerna).

## Minikube Setup

* [Setting up Minikube](./tutorials/minikube.md)

Read the setup scripts before running:

```
npm run setup
```

```
lerna bootstrap
lerna run --scope transmute-eventstore truffle:test
lerna run --scope transmute-eventstore truffle:migrate
lerna run --scope ipfs-api build
ACCESS_TOKEN=$(node ./scripts/okta/get-okta-token.js) lerna run --scope transmute-eventstore test
```

## Recommended Tools

* [VS Code K8s Support](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools)
