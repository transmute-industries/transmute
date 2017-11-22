# Transmute Mono Repo  

[![Build Status](https://travis-ci.org/transmute-industries/lerna-transmute.svg?branch=master)](https://travis-ci.org/transmute-industries/lerna-transmute)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)


### Project Structure

We use the [lerna mono repo pattern](https://github.com/lerna/lerna).

```
lerna bootstrap
lerna run testrpc:start

lerna run truffle:migrate
lerna run build

lerna run test

```