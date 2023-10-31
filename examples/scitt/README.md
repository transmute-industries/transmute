# Supply Chain Integrity, Transparency, and Trust (scitt)

- [datatracker](https://datatracker.ietf.org/wg/scitt/about/)


As a global binary:

```sh
npm i -g @transmute/cli
```

Beware that this is not very well tested outside of macOS at this time.

## Create Private Signing Key

```sh
transmute scitt key generate \
--alg -35 \
--output examples/scitt/artifacts/privateKey.cbor
```

## Export Public Verification Key

```sh
transmute scitt key export \
--input  examples/scitt/artifacts/privateKey.cbor \
--output examples/scitt/artifacts/publicKey.cbor
```

## View COSE Keys as Diagnostic

```sh
transmute scitt key diagnose \
--input  examples/scitt/artifacts/privateKey.cbor \
--output examples/scitt/artifacts/privateKey.cbor.diag
```

If the output is markdown, the diagnostic is wrapped in markdown code blocks:

```sh
transmute scitt key diagnose \
--input  examples/scitt/artifacts/publicKey.cbor \
--output examples/scitt/artifacts/publicKey.cbor.md
```

## Sign Statement

```sh
transmute scitt statement issue \
--iss urn:example:123 \
--sub urn:example:456 \
--issuer-key examples/scitt/artifacts/privateKey.cbor \
--statement  examples/scitt/artifacts/SAGVendorResponseSAMPLE.xml \
--signed-statement examples/scitt/artifacts/SAGVendorResponseSAMPLE.xml.cbor
```

```sh
transmute scitt statement issue \
--iss urn:example:123 \
--sub urn:example:456 \
--issuer-key examples/scitt/artifacts/privateKey.cbor \
--statement  examples/scitt/artifacts/sbom-tool.spdx.json \
--signed-statement examples/scitt/artifacts/sbom-tool.spdx.json.cbor
```

## View Signed Statement as Diagnostic


```sh
transmute scitt statement diagnose \
--input  examples/scitt/artifacts/sbom-tool.spdx.json.cbor \
--output examples/scitt/artifacts/sbom-tool.spdx.json.cbor.md
```

## Verify Signed Statement

```sh
transmute scitt statement verify \
--issuer-key examples/scitt/artifacts/publicKey.cbor \
--statement  examples/scitt/artifacts/sbom-tool.spdx.json \
--signed-statement examples/scitt/artifacts/sbom-tool.spdx.json.cbor
```

## Create Transparent Statement

```sh
transmute scitt ledger receipt issue \
--iss urn:example:789 \
--sub urn:example:abc \
--issuer-key examples/scitt/artifacts/privateKey.cbor \
--signed-statement  examples/scitt/artifacts/sbom-tool.spdx.json.cbor \
--transparent-statement examples/scitt/artifacts/sbom-tool.spdx.json.ts.cbor \
--ledger  examples/scitt/artifacts/ledger.json
```

```sh
transmute scitt ledger receipt issue \
--iss urn:example:789 \
--sub urn:example:abc \
--issuer-key examples/scitt/artifacts/privateKey.cbor \
--signed-statement  examples/scitt/artifacts/SAGVendorResponseSAMPLE.xml.cbor \
--transparent-statement examples/scitt/artifacts/SAGVendorResponseSAMPLE.xml.ts.cbor \
--ledger  examples/scitt/artifacts/ledger.json
```

## Verify Transparent Statement

```sh
transmute scitt transparent statement verify \
--issuer-key examples/scitt/artifacts/publicKey.cbor \
--transparency-service-key examples/scitt/artifacts/publicKey.cbor \
--statement  examples/scitt/artifacts/sbom-tool.spdx.json \
--transparent-statement examples/scitt/artifacts/sbom-tool.spdx.json.ts.cbor
```

```sh
✅ verified: examples/scitt/artifacts/sbom-tool.spdx.json
✅ verified: examples/scitt/artifacts/sbom-tool.spdx.json.ts.cbor
```

~~~~ cbor-diag
18(                                 / COSE Sign 1                   /
    [
      h'a4013822...3a343536',       / Protected                     /
      {                             / Unprotected                   /
        -333: [                     / Receipts (1)                  /
          h'd284584e...93ef39e5'    / Receipt 1                     /
        ]
      },
      h'',                          / Detached payload              /
      h'4be77803...65c72b2a'        / Signature                     /
    ]
)
~~~~

~~~~ cbor-diag
{                                   / Protected                     /
  1: -35,                           / Algorithm                     /
  3: application/xml,               / Content type                  /
  4: h'317cedc7...c494e772',        / Key identifier                /
  13: {                             / CWT Claims                    /
    1: urn:example:123,             / Issuer                        /
    2: urn:example:456,             / Subject                       /
  }
}
~~~~

~~~~ cbor-diag
18(                                 / COSE Sign 1                   /
    [
      h'a4013822...3a616263',       / Protected                     /
      {                             / Unprotected                   /
        -222: {                     / Proofs                        /
          -1: [                     / Inclusion proofs (1)          /
            h'83040382...8628a031', / Inclusion proof 1             /
          ]
        },
      },
      h'',                          / Detached payload              /
      h'15280897...93ef39e5'        / Signature                     /
    ]
)
~~~~

~~~~ cbor-diag
{                                   / Protected                     /
  1: -35,                           / Algorithm                     /
  4: h'317cedc7...c494e772',        / Key identifier                /
  -111: 1,                          / Verifiable Data Structure     /
  13: {                             / CWT Claims                    /
    1: urn:example:789,             / Issuer                        /
    2: urn:example:abc,             / Subject                       /
  }
}
~~~~

~~~~ cbor-diag
[                                   / Inclusion proof 1             /
  4,                                / Tree size                     /
  3,                                / Leaf index                    /
  [                                 / Inclusion hashes (2)          /
     h'04eddd86...95df875d'         / Intermediate hash 1           /
     h'668e8854...8628a031'         / Intermediate hash 2           /
  ]
]
~~~~
 
## View Transparent Statement as Diagnostic


```sh
transmute scitt statement diagnose \
--input  examples/scitt/artifacts/sbom-tool.spdx.json.ts.cbor \
--output examples/scitt/artifacts/sbom-tool.spdx.json.ts.cbor.md
```

```sh
transmute scitt statement diagnose \
--input  examples/scitt/artifacts/SAGVendorResponseSAMPLE.xml.ts.cbor \
--output examples/scitt/artifacts/SAGVendorResponseSAMPLE.xml.ts.cbor.md
```

### x509 Certificates

... sigh ...

#### Create A Root Certificate

```sh
transmute scitt certificate create \
--alg ES384 \
--issuer "CN=Test CA" \
--subject "CN=Test CA" \
--valid-from 2020/01/01 \
--valid-until 2020/01/03 \
--subject-guid f81d4fae-7dec-11d0-a765-00a0c91e6bf6 \
--subject-did did:web:root.transparency.example \
--subject-private-key examples/scitt/artifacts/x.509.ca.cert.privateKey.cbor \
--subject-certificate examples/scitt/artifacts/x.509.ca.cert.publicKey.pem
```

#### Create A User Certificate

```sh
transmute scitt certificate create \
--alg ES384 \
--valid-from 2020/01/01 \
--valid-until 2020/01/03 \
--issuer-private-key examples/scitt/artifacts/x.509.ca.cert.privateKey.cbor \
--issuer-certificate examples/scitt/artifacts/x.509.ca.cert.publicKey.pem \
--subject "CN=Test, O=Дом" \
--subject-did did:web:issuer.key.transparency.example \
--subject-private-key examples/scitt/artifacts/x.509.user.privateKey.cbor \
--subject-public-key examples/scitt/artifacts/x.509.user.publicKey.cbor \
--subject-certificate examples/scitt/artifacts/x.509.user.cert.publicKey.pem
```

## View Diagnostic of X5C signed statement

```sh
transmute scitt key diagnose \
--input  examples/scitt/artifacts/x.509.user.publicKey.cbor \
--output examples/scitt/artifacts/x.509.user.publicKey.cbor.diag.md
```

~~~~ cbor-diag
{                                   / COSE Key                      /
  1: 2,                             / Type                          /
  2: h'75726e3a...32636573',        / Identifier                    /
  3: -35,                           / Algorithm                     /
  -1: 2,                            / Curve                         /
  -2: h'f9754dbf...0001e040',       / x public key component        /
  -3: h'c1fe17d9...56e0822f',       / y public key component        /
  -66666: [                         / X.509 Certificate Chain       /
    h'308201b4...f55dda17',         / X.509 Certificate             /
    h'308201c0...90680d74',         / X.509 Certificate             /
  ],
}
~~~~

```sh
transmute scitt statement issue \
--iss urn:example:123 \
--sub urn:example:456 \
--cty application/jwk-set+json \
--issuer-key examples/scitt/artifacts/x.509.user.privateKey.cbor \
--statement  examples/scitt/artifacts/jwks.json \
--signed-statement examples/scitt/artifacts/jwks.json.cbor
```

```sh
transmute scitt statement diagnose \
--input  examples/scitt/artifacts/jwks.json.cbor \
--output examples/scitt/artifacts/jwks.json.cbor.md
```

~~~~ cbor-diag
18(                                 / COSE Sign 1                   /
    [
      h'a5182182...3a343536',       / Protected                     /
      {},                           / Unprotected                   /
      h'',                          / Detached payload              /
      h'638b9ddd...8e353675'        / Signature                     /
    ]
)
~~~~

~~~~ cbor-diag
{                                   / Protected                     /
  33: [                             / X.509 Certificate Chain       /
    h'308201b4...f55dda17',         / X.509 Certificate             /
    h'308201c0...90680d74',         / X.509 Certificate             /
  ],
  1: -35,                           / Algorithm                     /
  3: application/jwk-set+json,      / Content type                  /
  4: h'75726e3a...32636573',        / Key identifier                /
  13: {                             / CWT Claims                    /
    1: urn:example:123,             / Issuer                        /
    2: urn:example:456,             / Subject                       /
  },
}
~~~~

# Verifying a signed statement with x5c

```sh
transmute scitt statement verifyx5c \
--date "2020/01/01 12:00" \
--statement  examples/scitt/artifacts/jwks.json \
--signed-statement examples/scitt/artifacts/jwks.json.cbor
```

```json
{
  "verification": true,
  "jwks": {
    "keys": [
      {
        "kty": "EC",
        "x": "-XVNv_1baavLnBh9zKjd8pKUohbXeigQHynEtNVjnasV9gU8Ys1SYEMNILIAAeBA",
        "y": "wf4X2Yqs4fib3jq_daFpMzW2tgHP-DslswkYNRPeNYJftz96-16Tjve2rkRW4IIv",
        "crv": "P-384",
        "alg": "ES384",
        "kid": "urn:ietf:params:oauth:jwk-thumbprint:sha-256:jjKpaaWUe23R7oSGRTJbP24_Qn2u3EZT3XruqRK2ces",
        "x5t#S256": "q_NGNEyFpBI6FsAE6bQPVPjv-z-ezHNbz9OOPBX7JYo",
        "x5c": [
          "MIIBtDCCATmgAwIBAgIBATAKBggqhkjOPQQDAzASMRAwDgYDVQQDEwdUZXN0IENBMB4XDTIwMDEwMTA2MDAwMFoXDTIwMDEwMzA2MDAwMFowIDENMAsGA1UEAxMEVGVzdDEPMA0GA1UECgwG0JTQvtC8MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAE+XVNv/1baavLnBh9zKjd8pKUohbXeigQHynEtNVjnasV9gU8Ys1SYEMNILIAAeBAwf4X2Yqs4fib3jq/daFpMzW2tgHP+DslswkYNRPeNYJftz96+16Tjve2rkRW4IIvo1UwUzAyBgNVHREEKzAphidkaWQ6d2ViOmlzc3Vlci5rZXkudHJhbnNwYXJlbmN5LmV4YW1wbGUwHQYDVR0OBBYEFI/quyLB5/fyan29T6kM6D4aioFAMAoGCCqGSM49BAMDA2kAMGYCMQCo3pkJOeMxSIjzWzOk9ljVPl55SbZvmf80M3mfdDP1rt497/RRu+9aH7o63M+MbOgCMQDTTsU3tHgtrxrZj+sB8ieKNhdeqhSpH7ZOfq+IYfPc9YyoIH6EUH5GvyQ3zvVd2hc=",
          "MIIBwDCCAUagAwIBAgIBATAKBggqhkjOPQQDAzASMRAwDgYDVQQDEwdUZXN0IENBMB4XDTIwMDEwMTA2MDAwMFoXDTIwMDEwMzA2MDAwMFowEjEQMA4GA1UEAxMHVGVzdCBDQTB2MBAGByqGSM49AgEGBSuBBAAiA2IABExKcR7XZ5gA2kY8FsG2jpSdQrtaEq+JSBUAf14dSmV2yo8trF6K2jKInuBQM2B9wCS1FLbD8lCvi6NS1porEEF477mtgM5usErtzl6TPxNKSM34L89w04lqYscZy9nTGKNwMG4wTQYDVR0RBEYwRKAfBgkrBgEEAYI3GQGgEgQQrk8d+Ox90BGnZQCgyR5r9oYhZGlkOndlYjpyb290LnRyYW5zcGFyZW5jeS5leGFtcGxlMB0GA1UdDgQWBBRPOtPWvOghtcfhXTDBDG76Icg/GTAKBggqhkjOPQQDAwNoADBlAjBWmTz3deeB85XOn91Vyp+wclOeokT988HN4er+gTSLLiao/30MQ2B5g+rBsVeCqRECMQDoUMnYOh3vAoGXOFheURb4U4DPQ75+LQ5BTu2OOWdfEitbD1d3qZjLC33WCZBoDXQ="
        ]
      },
      {
        "kty": "EC",
        "x": "TEpxHtdnmADaRjwWwbaOlJ1Cu1oSr4lIFQB_Xh1KZXbKjy2sXoraMoie4FAzYH3A",
        "y": "JLUUtsPyUK-Lo1LWmisQQXjvua2Azm6wSu3OXpM_E0pIzfgvz3DTiWpixxnL2dMY",
        "crv": "P-384",
        "alg": "ES384",
        "kid": "urn:ietf:params:oauth:jwk-thumbprint:sha-256:uYEopbffvUaaO5hcIUFTLMwtXsLzGi53tBlsuzJ3Rt4",
        "x5t#S256": "NovrR094q3QBx-J16F3cTn-IYg-E0jfiwKy_Zm1K5vM",
        "x5c": [
          "MIIBwDCCAUagAwIBAgIBATAKBggqhkjOPQQDAzASMRAwDgYDVQQDEwdUZXN0IENBMB4XDTIwMDEwMTA2MDAwMFoXDTIwMDEwMzA2MDAwMFowEjEQMA4GA1UEAxMHVGVzdCBDQTB2MBAGByqGSM49AgEGBSuBBAAiA2IABExKcR7XZ5gA2kY8FsG2jpSdQrtaEq+JSBUAf14dSmV2yo8trF6K2jKInuBQM2B9wCS1FLbD8lCvi6NS1porEEF477mtgM5usErtzl6TPxNKSM34L89w04lqYscZy9nTGKNwMG4wTQYDVR0RBEYwRKAfBgkrBgEEAYI3GQGgEgQQrk8d+Ox90BGnZQCgyR5r9oYhZGlkOndlYjpyb290LnRyYW5zcGFyZW5jeS5leGFtcGxlMB0GA1UdDgQWBBRPOtPWvOghtcfhXTDBDG76Icg/GTAKBggqhkjOPQQDAwNoADBlAjBWmTz3deeB85XOn91Vyp+wclOeokT988HN4er+gTSLLiao/30MQ2B5g+rBsVeCqRECMQDoUMnYOh3vAoGXOFheURb4U4DPQ75+LQ5BTu2OOWdfEitbD1d3qZjLC33WCZBoDXQ="
        ]
      }
    ]
  }
}
```