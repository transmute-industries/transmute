# Transmute Dashboard

This react dashboard provides a reference implementation for the transmute framework, and some centralized directory support for the transmute platform.

It is WIP, and subject to change.

```
lerna bootstrap
npm run truffle:migrate
npm run start
```

### Deployment

This is for contributors only.

```
npm run build
npm run deploy

cd ./build
git add -A 
git commit -m `cat ../package.json | jq -r '.version'` 
git push origin master
```