## Develop

```
npm i
npm t
```

### Testing Commands

Install a local build of the cli globally using:

```sh
npm i -g .
```

Test a local build with this npm script alias:

```sh
npm run transmute -- controller key generate \
--alg ES384 \
--output examples/keys/private.ES384.json
```
