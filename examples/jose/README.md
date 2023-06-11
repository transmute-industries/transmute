
# Javascript Object Signing and Encryption (jose)

## Create Private Key

```sh
npm run transmute -- controller key generate \
--alg ES384 \
--output examples/jose/private.ES384.json
```

## Export Public Key

```sh
npm run transmute -- controller key export \
--input  examples/jose/private.ES384.json \
--output examples/jose/public.ES384.json
```

## Detached

### Sign 

```sh
npm run transmute -- controller key sign \
--issuer-key examples/jose/private.ES384.json \
--input  examples/jose/manifest.spdx.json \
--output examples/jose/manifest.spdx.jws.json
```

### Verify

```sh
npm run transmute -- controller key verify \
--verifier-key examples/jose/public.ES384.json \
--input  examples/jose/manifest.spdx.json \
--signature examples/jose/manifest.spdx.jws.json \
--output examples/jose/manifest.spdx.jws.verified.json
```

## Encryption


### Generate Decryption Key

```sh
npm run transmute -- controller key generate \
--alg ECDH-ES+A128KW \
--output examples/jose/private.decryption.jwk.json
```

### Export Encryption Key

```sh
npm run transmute -- controller key export \
--input  examples/jose/private.decryption.jwk.json \
--output examples/jose/public.encryption.jwk.json
```

### Encrypt to Recipient Public Key

```sh
npm run transmute -- controller key encrypt \
--recipient examples/jose/public.encryption.jwk.json \
--input examples/jose/manifest.spdx.json \
--output examples/jose/manifest.spdx.jwe.json
```

### Decrypt with Recipient Private Key

```sh
npm run transmute -- controller key decrypt \
--recipient examples/jose/private.decryption.jwk.json \
--input examples/jose/manifest.spdx.jwe.json \
--output examples/jose/manifest.spdx.jwe.decrypted.json
```
