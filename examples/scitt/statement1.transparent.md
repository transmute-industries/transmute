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
      h'720b1778...45ebb92c'        / Signature                             /
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
          h'83020081...8cdd933f',   / Inclusion proof 1                     /
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
  0,                                / Leaf index                            /
  [                                 / Inclusion hashes (1)                  /
     h'47e5cda0...8cdd933f'         / Intermediate hash 1                   /
  ]
]
~~~~