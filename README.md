# Transmute Mono Repo  

[![Build Status](https://travis-ci.org/transmute-industries/lerna-transmute.svg?branch=master)](https://travis-ci.org/transmute-industries/lerna-transmute)
[![codecov](https://codecov.io/gh/transmute-industries/lerna-transmute/branch/master/graph/badge.svg)](https://codecov.io/gh/transmute-industries/lerna-transmute)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)


### Project Structure

We use the [lerna mono repo pattern](https://github.com/lerna/lerna).

```
npm install -g lerna
lerna bootstrap
lerna run truffle:test
lerna run truffle:migrate
lerna run build --stream
lerna run test --stream
```