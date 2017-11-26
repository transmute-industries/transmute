# Transmute dApp

https://dapp.transmute.industries/

An advanced configuration of the transmute dapp.

## Depenencies

- [Latest Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Firebase](https://firebase.google.com)

## Getting Started

### Git & Docker

```
$ git clone https://github.com/transmute-industries/transmute-dapp.git
```

### Update Configurations

#### functions/.transmute

- Maybe create a project on [firebase.google.com](https://firebase.google.com/)
- Add/Update `firebase-service-account.json` - https://firebase.google.com/docs/admin/setup
- Add/Update `firebase-client-config.json` - https://firebase.google.com/docs/web/setup
- Update `environment.secret.env`
- Update `environment.node` & `environment.web`

#### dapp/src/environment.web.ts

- Update to use your `firebase-client-config.json`


### Theme

We use react-semantic-ui and a custom theme for this demo. If you wish to personalize this dapp's theme:

```
cd semantic
gulp watch
```

Any changes you make to semantic ui will be reflected in the dapp. 

Only run this if you are working on the front-end of a dapp.

### Run the dApp!
```
$ docker-compose up
```
