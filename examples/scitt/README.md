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
--issuer-kid did:web:scitt.xyz#urn:ietf:params:oauth:jwk-thumbprint:sha-256:gP8lW7iRNl2u0oE99RtuAQ7hnpWQIfEF8f0n_tK_ch8 \
--statement  examples/scitt/statement.jpg \
--signed-statement examples/scitt/statement.cose

npm run transmute -- scitt statement verify \
--statement  examples/scitt/statement.jpg \
--signed-statement examples/scitt/statement.cose

```
-->

### Issue 

```sh
transmute scitt statement issue \
--issuer-key examples/scitt/private.signing.jwk.json \
--issuer-kid did:web:scitt.xyz#urn:ietf:params:oauth:jwk-thumbprint:sha-256:gP8lW7iRNl2u0oE99RtuAQ7hnpWQIfEF8f0n_tK_ch8 \
--statement  examples/scitt/statement.jpg \
--signed-statement examples/scitt/statement.cose
```

### Verify

```sh
transmute scitt statement verify \
--statement  examples/scitt/statement.jpg \
--signed-statement examples/scitt/statement.cose \
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
--transparency-service https://scitt.xyz/api/did:web:scitt.xyz \
--statement  examples/scitt/statement.jpg \
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

## Issue

Assumes the transparency service has a registration policy that accepts statements signed by specific issuers, and that the statement provided is signed by one of those issuers.

```sh
transmute scitt receipt issue \
--transparency-service https://scitt.xyz/api/did:web:scitt.xyz \
--statement  examples/scitt/statement.jpg \
--signed-statement  examples/scitt/statement.cose \
--transparent-statement examples/scitt/statement.transparent.cose
```

## Verify

Assumes the issuers of the signed statenment and the receipt are trusted by the client.

```sh
transmute scitt receipt verify \
--statement  examples/scitt/statement.jpg \
--transparent-statement examples/scitt/statement.transparent.cose
```