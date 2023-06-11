
# Javascript Object Signing and Encryption (jose)

## Create Private Signing Key

```sh
npm run transmute -- key generate \
--alg ES384 \
--output examples/jose/private.signing.jwk.json
```

## Export Public Verification Key

```sh
npm run transmute -- key export \
--input  examples/jose/private.signing.jwk.json \
--output examples/jose/public.verifying.jwk.json
```

## Detached

### Sign 

```sh
npm run transmute -- key sign \
--issuer-key examples/jose/private.signing.jwk.json \
--input  examples/jose/manifest.spdx.json \
--output examples/jose/manifest.spdx.jws.json
```

### Verify

```sh
npm run transmute -- key verify \
--verifier-key examples/jose/public.verifying.jwk.json \
--input  examples/jose/manifest.spdx.json \
--signature examples/jose/manifest.spdx.jws.json \
--output examples/jose/manifest.spdx.jws.verified.json
```

## Encryption


### Generate Decryption Key

```sh
npm run transmute -- key generate \
--alg ECDH-ES+A128KW \
--output examples/jose/private.decryption.jwk.json
```

### Export Encryption Key

```sh
npm run transmute -- key export \
--input  examples/jose/private.decryption.jwk.json \
--output examples/jose/public.encryption.jwk.json
```

### Encrypt to Recipient Public Key

```sh
npm run transmute -- key encrypt \
--recipient examples/jose/public.encryption.jwk.json \
--input examples/jose/manifest.spdx.json \
--output examples/jose/manifest.spdx.jwe.json
```

### Decrypt with Recipient Private Key

```sh
npm run transmute -- key decrypt \
--recipient examples/jose/private.decryption.jwk.json \
--input examples/jose/manifest.spdx.jwe.json \
--output examples/jose/manifest.spdx.jwe.decrypted.json
```
