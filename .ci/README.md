### CI tools

These are the various scripts that are run in CI

### Local Travis build

From the root of this repo

```
.ci/ci.local
```

This will attempt a local run of the travis-ci yaml.

#### Manual run

You can also separate out the steps and run them individually

```
.ci/start-travisci-local
.ci/run-travisci-local
.ci/enter-travisci-local
```
