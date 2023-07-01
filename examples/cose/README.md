
# CBOR Object Signing and Encryption (cose)

## Create Private Signing Key

```sh
transmute key generate \
--alg ES384 \
--output examples/cose/private.signing.jwk.json
```


## Export Public Verification Key

```sh
transmute key export \
--input  examples/cose/private.signing.jwk.json \
--output examples/cose/public.verifying.jwk.json
```

<!--

npm run transmute -- graph \
--env '.env' \
--input  'examples/cose/public.verifying.jwk.json'

-->

<img src="./public.verifying.jwk.png" />