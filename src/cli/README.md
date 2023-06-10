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
npm run transmute -- controller key generate \
--alg ECDH-ES+A128KW \
--output scratch/private.jwk.decrypt.json
```

```sh
npm run transmute -- controller key export \
--input scratch/private.jwk.decrypt.json \
--output scratch/public.jwk.encrypt.json
```

```sh
npm run transmute -- controller key encrypt \
--recipient scratch/public.jwk.encrypt.json \
--input scratch/content-0.json \
--output scratch/ciphertext.json
```

```sh
npm run transmute -- controller key decrypt \
--recipient scratch/private.jwk.decrypt.json \
--input scratch/ciphertext.json \
--output scratch/content-0.decrypted.json
```
