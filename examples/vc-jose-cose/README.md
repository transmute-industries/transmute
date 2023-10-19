
## Securing Verifiable Credentials using JOSE and COSE

- https://www.w3.org/TR/vc-jose-cose/

```bash
npm i -g @transmute/cli
```


### Create Private Signing Key

```sh
transmute key generate \
--alg ES384 \
--output examples/vc-jose-cose/private.signing.jwk.json
```

### Export Public Verification Key

```sh
transmute key export \
--input  examples/vc-jose-cose/private.signing.jwk.json \
--output examples/vc-jose-cose/public.verifying.jwk.json
```

### Issue Credential

```sh
transmute w3c vc issue \
--issuer-key examples/vc-jose-cose/private.signing.jwk.json \
--holder-key examples/vc-jose-cose/public.verifying.jwk.json \
--claimset  examples/vc-jose-cose/issuance-claims.yaml \
--verifiable-credential examples/vc-jose-cose/vc.sd-jwt
```

### Disclose Presentation

```sh
transmute w3c vc disclose \
--holder-key examples/vc-jose-cose/private.signing.jwk.json \
--audience verifier.example \
--nonce challenge.example \
--verifiable-credential examples/vc-jose-cose/vc.sd-jwt \
--disclosure  examples/vc-jose-cose/disclosure-claims.yaml \
--verifiable-presentation examples/vc-jose-cose/vp.sd-jwt
```

### Presentation Verify

```sh
transmute w3c vc verify \
--issuer-key examples/vc-jose-cose/public.verifying.jwk.json \
--holder-key examples/vc-jose-cose/public.verifying.jwk.json \
--audience verifier.example \
--nonce challenge.example \
--verifiable-presentation examples/vc-jose-cose/vp.sd-jwt \
--verification examples/vc-jose-cose/vp.sd-jwt.verification.json
```

### Verification Validate

```sh
transmute w3c vc validate \
--transparency-service https://dune.did.ai \
--verification examples/vc-jose-cose/vp.sd-jwt.verification.json
```

### Update Credential Status

```sh
transmute w3c vc status \
--verification examples/vc-jose-cose/vp.sd-jwt.verification.json \
--verifiable-credential examples/vc-jose-cose/status-list.vc.sd-jwt \
--revocation false
```