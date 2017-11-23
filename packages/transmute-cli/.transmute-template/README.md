# .transmute

This directory is used to store configuration files and secrets.

A valuable target for an attacker.

For now, we're still exploring. 

If you have suggetions for improving this, please [open an issue](https://github.com/transmute-industries/transmute-cli/issues/new).

### firebase-client-config.json

This file is your firebase client config. This config will be published with your web application or client.

It is obtained here: https://firebase.google.com/docs/web/setup

### firebase-service-account.json

This file contains private keys used to create authentication tokens, and SHOULD NEVER BE PUBLISHED.

If you accidentally publish this file, you should quickly destroy the service account:

It is obtained here: https://firebase.google.com/docs/admin/setup


### environment.secret.env

This is a dotenv file for storing secrets and it SHOULD NEVER BE PUBLISHED.

If you accidentally publish this file, review your secrets and revoke or replace them wherever possible.

### Developing .transmute

You'll need to rebuild .transmute from some stored secret directory often when testing configuration changes.

```
yarn transmute setup --from ~/Code/secrets/.transmute/
```

### Testing apps that use .transmute

Once you have setup a .transmute, it will be used by init.

```
rm -rf ../smoke/dapp/ && yarn transmute init ../smoke/
```

### Full dapp rebuild after environments setup

```
yarn transmute setup --from ~/Code/secrets/.transmute/ && rm -rf ../smoke/dapp/ && yarn transmute init ../smoke/
```


### Other commands

```
yarn add global transmute-cli@latest

rm -rf ./dapp
transmute setup 
transmute init .

# cd dapp 
# firebase init 
# yarn install && cd functions && yarn install && cd ..
# NO TO EVERYTHING

# firebase deploy --only functions 
```