# Transmute Mono Repo  

[![Build Status](https://travis-ci.org/transmute-industries/lerna-transmute.svg?branch=master)](https://travis-ci.org/transmute-industries/lerna-transmute)
[![codecov](https://codecov.io/gh/transmute-industries/lerna-transmute/branch/master/graph/badge.svg)](https://codecov.io/gh/transmute-industries/lerna-transmute)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)


### Project Structure

We use the [lerna mono repo pattern](https://github.com/lerna/lerna).

```
npm install -g lerna
```


Clean the packages in the current Lerna repo. Removes the node_modules directory from all packages.

```
$ lerna clean
```

Bootstrap the packages in the current Lerna repo. Installs all of their dependencies and links any cross-dependencies.

```
$ lerna bootstrap
```

Other commands:

```
$ lerna run truffle:migrate
$ lerna run truffle:test
$ lerna run build
$ lerna run test
```

For testing a specific package (Ex: transmute-services):
```
$ lerna run truffle:test --scope transmute-services
```
