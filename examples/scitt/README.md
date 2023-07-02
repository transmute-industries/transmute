# Supply Chain Integrity, Transparency, and Trust (scitt)

- [datatracker](https://datatracker.ietf.org/wg/scitt/about/)


## Create Private Signing Key

```sh
transmute key generate \
--alg ES384 \
--output examples/scitt/private.signing.jwk.json
```


## Export Public Verification Key

```sh
transmute key export \
--input  examples/scitt/private.signing.jwk.json \
--output examples/scitt/public.verifying.jwk.json
```

<!--

npm run transmute -- graph \
--env '.env' \
--input  'examples/scitt/public.verifying.jwk.json'

-->

<img src="./public.verifying.jwk.png" />

## Statements

<!-- 
```sh
npm run build;

npm run transmute -- scitt statement issue \
--issuer-key examples/scitt/private.signing.jwk.json \
--input  examples/scitt/statement.jpg \

npm run transmute -- scitt statement verify \
--input  examples/scitt/statement.jpg \
--signature examples/scitt/statement.cose \

```
-->

### Issue 

```sh
transmute scitt statement issue \
--issuer-key examples/scitt/private.signing.jwk.json \
--input  examples/scitt/statement.jpg \
--output examples/scitt/statement.cose
```

### Verify

```sh
transmute scitt statement verify \
--input  examples/scitt/statement.jpg \
--signature examples/scitt/statement.cose \
```

## Receipts

<!-- 
```sh
npm run build;

npm run transmute -- scitt receipt attach \
--signed-statement  examples/scitt/statement.cose \
--receipt  examples/scitt/statement.inclusion.cose \
--transparent-statement examples/scitt/statement.transparent.cose

npm run transmute -- scitt receipt detach \
--signed-statement  examples/scitt/statement.cose \
--receipt  examples/scitt/statement.inclusion.cose \
--transparent-statement examples/scitt/statement.transparent.cose

npm run transmute -- scitt receipt issue \
--signed-statement  examples/scitt/statement.cose \
--transparent-statement examples/scitt/statement.transparent.cose

npm run transmute -- scitt receipt verify \
--statement  examples/scitt/statement.jpg \
--transparent-statement examples/scitt/statement.transparent.cose
```
-->

## Attach

```sh
transmute scitt receipt attach \
--receipt  examples/scitt/statement.inclusion.cose \
--signed-statement  examples/scitt/statement.cose  \
--transparent-statement examples/scitt/statement.transparent.cose
```

## Detach

```sh
transmute scitt receipt detach \
--receipt  examples/scitt/statement.inclusion.cose \
--signed-statement  examples/scitt/statement.cose  \
--transparent-statement examples/scitt/statement.transparent.cose
```

