# Transmute

[![Build Status](https://travis-ci.org/transmute-industries/transmute.svg?branch=master)](https://travis-ci.org/transmute-industries/lerna-transmute)
[![codecov](https://codecov.io/gh/transmute-industries/transmute/branch/master/graph/badge.svg)](https://codecov.io/gh/transmute-industries/transmute)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

## Dependencies

* [IPFS](https://ipfs.io/)
* [Ganache CLI](https://github.com/trufflesuite/ganache-cli)
* [Truffle](http://truffleframework.com/)

```
npm install -g lerna ethereumjs-testrpc truffle
```

### Commands

```
lerna clean
lerna bootrstrap
lerna run cleanup
lerna run contracts:migrate
lerna run contracts:generate
lerna bootstrap
lerna run test --scope transmute-framework
```

### Project Structure

We use the [lerna mono repo pattern](https://github.com/lerna/lerna).
