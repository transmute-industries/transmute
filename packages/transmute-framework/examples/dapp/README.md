# Create React dApp!

#### :rocket: Powered by Firebase and Transmute Framework :rocket:

Sign up for Firebase and Firestore.

In order for cloud functions to make outbound network requests, you will need to setup billing for the project.

This is necessary for your service to talk to any ethereum network.

https://firebase.google.com/

Support for other cloud functions and databases will come in future releases.

## Getting Started

Install the dapp dependencies:

```
$ yarn install && cd functions && yarn install && cd ..
```

### Run the dApp Backend!

```
$ transmute serve
```

### Run the dApp!

```
$ yarn start
```

### Deploy Functiosn Env

```
$ firebase init 
$ truffle migrate --network azure
$ transmute mig-env firebase dapp ~/.transmute/environment.secret.env
$ firebase deploy --only functions

```