# Supply Chain Integrity, Transparency, and Trust (scitt)

- [datatracker](https://datatracker.ietf.org/wg/scitt/about/)


## Create Private Signing Key

```sh
npm run transmute -- scitt key generate \
--alg -35 \
--output examples/scitt/artifacts/privateKey.cbor
```

## Export Public Verification Key

```sh
npm run transmute -- scitt key export \
--input  examples/scitt/artifacts/privateKey.cbor \
--output examples/scitt/artifacts/publicKey.cbor
```

## View COSE Keys as Diagnostic

```sh
npm run transmute -- scitt key diagnose \
--input  examples/scitt/artifacts/privateKey.cbor \
--output examples/scitt/artifacts/privateKey.cbor.diag
```

If the output is markdown, the diagnostic is wrapped in markdown code blocks:

```sh
npm run transmute -- scitt key diagnose \
--input  examples/scitt/artifacts/publicKey.cbor \
--output examples/scitt/artifacts/publicKey.cbor.md
```

## Sign Statement

```sh
npm run transmute -- scitt statement issue \
--iss urn:example:123 \
--sub urn:example:456 \
--issuer-key examples/scitt/artifacts/privateKey.cbor \
--statement  examples/scitt/artifacts/SAGVendorResponseSAMPLE.xml \
--signed-statement examples/scitt/artifacts/SAGVendorResponseSAMPLE.xml.cbor
```

```sh
npm run transmute -- scitt statement issue \
--iss urn:example:123 \
--sub urn:example:456 \
--issuer-key examples/scitt/artifacts/privateKey.cbor \
--statement  examples/scitt/artifacts/sbom-tool.spdx.json \
--signed-statement examples/scitt/artifacts/sbom-tool.spdx.json.cbor
```

## View Signed Statement as Diagnostic


```sh
npm run transmute -- scitt statement diagnose \
--input  examples/scitt/artifacts/sbom-tool.spdx.json.cbor \
--output examples/scitt/artifacts/sbom-tool.spdx.json.cbor.md
```

## Verify Signed Statement

```sh
npm run transmute -- scitt statement verify \
--issuer-key examples/scitt/artifacts/publicKey.cbor \
--statement  examples/scitt/artifacts/sbom-tool.spdx.json \
--signed-statement examples/scitt/artifacts/sbom-tool.spdx.json.cbor
```

## Create Transparent Statement

```sh
npm run transmute -- scitt ledger receipt issue \
--iss urn:example:789 \
--sub urn:example:abc \
--issuer-key examples/scitt/artifacts/privateKey.cbor \
--signed-statement  examples/scitt/artifacts/sbom-tool.spdx.json.cbor \
--transparent-statement examples/scitt/artifacts/sbom-tool.spdx.json.ts.cbor \
--ledger  examples/scitt/artifacts/ledger.sqlite
```

```sh
npm run transmute -- scitt ledger receipt issue \
--iss urn:example:789 \
--sub urn:example:abc \
--issuer-key examples/scitt/artifacts/privateKey.cbor \
--signed-statement  examples/scitt/artifacts/SAGVendorResponseSAMPLE.xml.cbor \
--transparent-statement examples/scitt/artifacts/SAGVendorResponseSAMPLE.xml.ts.cbor \
--ledger  examples/scitt/artifacts/ledger.sqlite
```

## Verify Transparent Statement

```sh
npm run transmute -- scitt transparent statement verify \
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
npm run transmute -- scitt statement diagnose \
--input  examples/scitt/artifacts/sbom-tool.spdx.json.ts.cbor \
--output examples/scitt/artifacts/sbom-tool.spdx.json.ts.cbor.md
```

```sh
npm run transmute -- scitt statement diagnose \
--input  examples/scitt/artifacts/SAGVendorResponseSAMPLE.xml.ts.cbor \
--output examples/scitt/artifacts/SAGVendorResponseSAMPLE.xml.ts.cbor.md
```

### x509 Certificates

... sigh ...

#### Create A Root Certificate

```sh
npm run transmute -- scitt certificate create \
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
npm run transmute -- scitt certificate create \
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
npm run transmute -- scitt key diagnose \
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
npm run transmute -- scitt statement issue \
--iss urn:example:123 \
--sub urn:example:456 \
--cty application/jwk-set+json \
--issuer-key examples/scitt/artifacts/x.509.user.privateKey.cbor \
--statement  examples/scitt/artifacts/jwks.json \
--signed-statement examples/scitt/artifacts/jwks.json.cbor
```

```sh
npm run transmute -- scitt statement diagnose \
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