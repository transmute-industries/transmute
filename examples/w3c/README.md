## Create Private Signing Key

```sh
transmute key generate \
--alg ES384 \
--output examples/w3c/private.signing.jwk.json
```

## Export Public Verification Key

```sh
transmute key export \
--input  examples/w3c/private.signing.jwk.json \
--output examples/w3c/public.verifying.jwk.json
```

### JSON-LD Controller Document

```sh
transmute controller create \
--accept 'application/did+ld+json' \
--id     'did:web:example.com' \
--input  'examples/w3c/public.verifying.jwk.json' \
--output 'examples/w3c/did.json'
```

<!-- 
npm run transmute -- controller create \
--accept 'application/did+ld+json' \
--id  'did:web:example.com' \
--input  'examples/w3c/public.verifying.jwk.json' \
--output 'examples/w3c/did.json'
-->

### Issue Verifiable Credential

<!-- 
npm run transmute -- w3c credential issue \
--issuer-key examples/w3c/private.signing.jwk.json \
--issuer-kid did:web:scitt.xyz#urn:ietf:params:oauth:jwk-thumbprint:sha-256:gP8lW7iRNl2u0oE99RtuAQ7hnpWQIfEF8f0n_tK_ch8 \
--claimset  examples/w3c/vc.claimset.json \
--verifiable-credential examples/w3c/vc.jwt
-->

```sh
transmute w3c credential issue \
--issuer-key examples/scitt/private.signing.jwk.json \
--issuer-kid did:web:scitt.xyz#urn:ietf:params:oauth:jwk-thumbprint:sha-256:gP8lW7iRNl2u0oE99RtuAQ7hnpWQIfEF8f0n_tK_ch8 \
--claimset  examples/w3c/vc.claimset.json \
--verifiable-credential examples/w3c/vc.jwt
```

### Verify Verifiable Credential

<!-- 
npm run transmute -- w3c credential verify \
--issuer-key examples/w3c/public.verifying.jwk.json \
--verifiable-credential examples/w3c/vc.jwt \
--output examples/w3c/vc.jwt.verified.json
-->

```sh
transmute w3c credential verify \
--issuer-key examples/w3c/public.verifying.jwk.json \
--verifiable-credential examples/w3c/vc.jwt \
--output examples/w3c/vc.jwt.verified.json
```


<!-- 
npm run transmute -- w3c credential verify \
--did-resolver https://transmute.id/api \
--verifiable-credential examples/w3c/vc.jwt \
--output examples/w3c/vc.jwt.verified.json
-->

```sh
transmute w3c credential verify \
--did-resolver https://transmute.id/api \
--verifiable-credential examples/w3c/vc.jwt \
--output examples/w3c/vc.jwt.verified.json
```


### Issue Verifiable Presentation


<!-- 
npm run transmute -- w3c presentation issue \
--holder-key examples/scitt/private.signing.jwk.json \
--holder-kid did:web:scitt.xyz#urn:ietf:params:oauth:jwk-thumbprint:sha-256:gP8lW7iRNl2u0oE99RtuAQ7hnpWQIfEF8f0n_tK_ch8 \
--claimset  examples/w3c/vp.claimset.json \
--verifiable-presentation examples/w3c/vp.jwt
-->

```sh
transmute w3c presentation issue \
--holder-key examples/scitt/private.signing.jwk.json \
--holder-kid did:web:scitt.xyz#urn:ietf:params:oauth:jwk-thumbprint:sha-256:gP8lW7iRNl2u0oE99RtuAQ7hnpWQIfEF8f0n_tK_ch8 \
--claimset  examples/w3c/vp.claimset.json \
--verifiable-presentation examples/w3c/vp.jwt
```


### Verify Verifiable Presentation

<!-- 
npm run transmute -- w3c presentation verify \
--holder-key examples/w3c/public.verifying.jwk.json \
--verifiable-presentation examples/w3c/vp.jwt \
--output examples/w3c/vp.jwt.verified.json
-->

```sh
transmute w3c presentation verify \
--holder-key examples/w3c/public.verifying.jwk.json \
--verifiable-presentation examples/w3c/vp.jwt \
--output examples/w3c/vp.jwt.verified.json
```


<!-- 
npm run transmute -- w3c presentation verify \
--did-resolver https://transmute.id/api \
--verifiable-presentation examples/w3c/vp.jwt \
--output examples/w3c/vp.jwt.verified.json
-->

```sh
transmute w3c presentation verify \
--did-resolver https://transmute.id/api \
--verifiable-presentation examples/w3c/vp.jwt \
--output examples/w3c/vp.jwt.verified.json
```