

The commands are for working with the `credentialSchema` extension to the W3C Verifiable Credentials Data Model.

Download a credential:

```bash
curl -sl https://w3c.github.io/vc-jose-cose-test-suite/testcases/secured-vc-status-list/status-list.jwt > examples/w3c/credential-schema/status-list.jwt
```

Download a verification key... save it as ``

```bash
transmute w3c credential verify \
--issuer-key examples/w3c/credential-schema/publicKeyJwk.json \
--verifiable-credential examples/w3c/credential-schema/status-list.jwt \
--output examples/w3c/credential-schema/status-list.jwt.verified.json
```
