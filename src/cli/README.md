## Testing Locally

### Authenticity

```sh
npm run transmute -- controller key generate \
--alg ES384 \
--output scratch/private.jwk.ES384.json
```

```sh
npm run transmute -- controller key export \
--input  scratch/private.jwk.ES384.json \
--output scratch/public.jwk.ES384.json
```

```sh
npm run transmute -- controller key sign \
--issuer-key scratch/private.jwk.ES384.json \
--input  scratch/content-0.json  \
--output scratch/detatched.signature.json
```

```sh
npm run transmute -- controller key verify \
--verifier-key scratch/public.jwk.ES384.json \
--input scratch/content-0.json \
--signature scratch/detatched.signature.json  \
--output scratch/verified.signature.json
```

### Confidentiality

```sh
npm run transmute -- controller key generate --alg ECDH-ES+A128KW --output private.jwk.json
```

```sh
npm run transmute -- controller key export --input private.jwk.json --output public.jwk.json
```

```sh
npm run transmute -- controller key encrypt --recipient public.jwk.json --input plaintext.json --output ciphertext.json
```

```sh
npm run transmute -- controller key decrypt --recipient private.jwk.json --input ciphertext.json --output plaintext.recovered.json
```
