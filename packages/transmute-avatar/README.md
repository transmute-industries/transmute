# UX Prototype for Transmute  

This repo is for prototyping user experiences built on top of transmute.

This is all experimental.

This repo has truffle tests that require the transmute-framework to be built first.

```
lerna bootstrap
lerna run truffle:migrate
lerna run build
lerna run truffle:test --scope transmute-avatar
```