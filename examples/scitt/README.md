# Supply Chain Integrity, Transparency, and Trust (scitt)

- [datatracker](https://datatracker.ietf.org/wg/scitt/about/)

## Create Private Signing Key

```sh
transmute key generate \
--alg ES384 \
--output examples/scitt/private.signing.jwk.json
```

## Export Public Verification Key

```sh
transmute key export \
--input  examples/scitt/private.signing.jwk.json \
--output examples/scitt/public.verifying.jwk.json
```

## Sign Statements

```bash
transmute scitt statement issue \
--issuer-key examples/scitt/private.signing.jwk.json \
--statement  examples/scitt/statement1.text \
--signed-statement examples/scitt/statement1.cose
```

```bash
transmute scitt statement issue \
--issuer-key examples/scitt/private.signing.jwk.json \
--statement  examples/scitt/statement2.text \
--signed-statement examples/scitt/statement2.cose
```

## Append Signature to Transparency Log

```bash
transmute scitt ledger append \
--issuer-key examples/scitt/private.signing.jwk.json \
--signed-statement  examples/scitt/statement1.cose \
--transparent-statement examples/scitt/statement1.transparent.cose \
--ledger  examples/scitt/db.sqlite
```

```bash
transmute scitt ledger append \
--issuer-key examples/scitt/private.signing.jwk.json \
--signed-statement  examples/scitt/statement2.cose \
--transparent-statement examples/scitt/statement2.transparent.cose \
--ledger  examples/scitt/db.sqlite
```

## Verify Transparency

```bash
transmute scitt transparency verify \
--statement  examples/scitt/statement2.text \
--transparent-statement examples/scitt/statement2.transparent.cose \
--issuer-key examples/scitt/public.verifying.jwk.json \
--transparency-service-key examples/scitt/public.verifying.jwk.json
```

## Diagnostic of Transparent Statement

```bash
transmute cose diagnostic diagnose \
--input  examples/scitt/statement2.transparent.cose \
--output examples/scitt/statement2.transparent.md
```

### Transparent Statement

~~~~ cbor-diag
18(                                 / COSE Single Signer Data Object        /
    [
      h'a3013822...6c61696e',       / Protected header                      /
      {                             / Unprotected header                    /
        300: [                      / Receipts (1)                          /
          h'd284585f...419c8ec0'    / Receipt 1                             /
        ]
      },
      h'',                          / Detached payload                      /
      h'b8552367...e8235a07'        / Signature                             /
    ]
)
~~~~

~~~~ cbor-diag
{                                   / Protected header                      /
  1: -35,                           / Cryptographic algorithm to use        /
  4: h'75726e3a...5f636838',        / Key identifier                        /
  3: "text/plain"                   / Content type of the payload           /
}
~~~~

### Receipt

~~~~ cbor-diag
18(                                 / COSE Single Signer Data Object        /
    [
      h'a2013822...5f636838',       / Protected header                      /
      {                             / Unprotected header                    /
        100: [                      / Inclusion proofs (1)                  /
          h'83020181...c6bf0202',   / Inclusion proof 1                     /
        ]
      },
      h'',                          / Detached payload                      /
      h'6140da0f...419c8ec0'        / Signature                             /
    ]
)
~~~~

~~~~ cbor-diag
{                                   / Protected header                      /
  1: -35,                           / Cryptographic algorithm to use        /
  4: h'75726e3a...5f636838'         / Key identifier                        /
}
~~~~

~~~~ cbor-diag
[                                   / Inclusion proof 1                     /
  2,                                / Tree size                             /
  1,                                / Leaf index                            /
  [                                 / Inclusion hashes (1)                  /
     h'5979d2d8...c6bf0202'         / Intermediate hash 1                   /
  ]
]
~~~~