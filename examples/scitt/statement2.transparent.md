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