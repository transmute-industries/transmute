# Transmute Dashboard

This react dashboard provides a reference implementation for the transmute framework, and some centralized directory support for the transmute platform.

It is WIP, and subject to change.

Currently, we are establishing an idenitity flow that is compatible with PGP, Ethereum and centralized directories, such as Auth0 and Okta.


```
lerna bootstrap
npm run truffle:migrate
npm run start
```

### Deployment

This is for contributors only.

`git submodule add https://github.com/transmute-industries/dashboard.transmute.network.git production`

```
npm run build
npm run deploy
```

If you have 2FA enabled: 

https://help.github.com/articles/providing-your-2fa-authentication-code/#when-youll-be-asked-for-a-personal-access-token-as-a-password