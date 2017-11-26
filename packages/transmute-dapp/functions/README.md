# Rebuild Node ENV

```sh
yarn transmute gen-node js transmute ~/.transmute/environment.secret.env ./functions/environment.node.js
```

### Migrate node ENV for Functions

```sh
yarn transmute mig-env firebase transmute ~/.transmute/environment.secret.env
```


### Deploy Functions

```sh
firebase deploy --only functions
```


### Serve Locally With ngrok

```sh
yarn transmute serve
```