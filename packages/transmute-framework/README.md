# Transmute Framework

TypeScript dApp Framework

Very alpha, expect breaking changes...

Requires node: v8.6.0


```
$ npm install transmute-cli@latest --save
$ yarn add transmute-cli@latest

$ npm install transmute-framework@latest --save
$ yarn add transmute-framework@latest
```

[![NPM version](https://img.shields.io/npm/v/transmute-framework.svg)](https://www.npmjs.com/package/transmute-framework)
[![Build Status](https://travis-ci.org/transmute-industries/transmute-framework.svg?branch=master)](https://travis-ci.org/transmute-industries/transmute-framework)
[![Coverage Status](https://coveralls.io/repos/github/transmute-industries/transmute-framework/badge.svg?branch=master)](https://coveralls.io/github/transmute-industries/transmute-framework?branch=master)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

You will need to sign up for firebase to see the full value of the framework (deploy your dapp, and functions).

```sh
# setup the cli
transmute setup --reset
# make sure checkout ~/.transmute and update the files there before proceeding.

# create a new dapp
transmute init --basic .

# build and run your dapp
cd dapp
yarn install
yarn start
```

See chrome developer console to checkout the framework object.

In order to login to firebase, you will need a local or deployed function.

The dapp comes with a login example.

```sh
# run functions locally
transmute serve
```

In order to generate firebase tokens required for login, you will need to setup a service account and make sure your environment.node is importing it properly.

With a local functions server running and testrpc running, you should be able to explore what developing with the transmute framework is like, while we prepare much better documentation and a nicer demo app.

If you have trouble feel free to open an issue, and we'll assist.


### Usage
```
yarn install           - install the package and its dependencies
yarn cleanup           - clean the project of all build and debug data
yarn testrpc:start     - start testrpc
yarn testrpc:stop      - stop testrpc
yarn truffle:migrate   - migrate truffle contracts
yarn truffle:test      - run truffle tests
yarn test              - test framework with jest (not truffle tests)
yarn build             - build the library
yarn docs              - build the docs
yarn docs:deploy       - deploy the docs
npm version patch      - increment the package version and create a tag
npm publish            - deploy the package to npm
pm2 kill               - kill testrpc and any other pm2 processes
```

### Contributing

Please fork and submit PRs. There are integration tests for truffle and javascript libraries that run in travis.

### References

- https://github.com/Upchain/truffle-template
- https://github.com/transmute-industries/eth-faucet
- https://github.com/AugurProject/augur/blob/master/src/modules/auth/actions/register.js
- https://airbitz.co/developer-api-library/
- https://github.com/Hotell/typescript-lib-starter



