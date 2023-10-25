~~~~ cbor-diag
18(                                 / COSE Sign 1                   /
    [
      h'a4013822...3a343536',       / Protected                     /
      {                             / Unprotected                   /
        -333: [                     / Receipts (1)                  /
          h'd284584e...bc37e274'    / Receipt 1                     /
        ]
      },
      h'',                          / Detached payload              /
      h'ace706f3...6a826e8d'        / Signature                     /
    ]
)
~~~~

~~~~ cbor-diag
{                                   / Protected                     /
  1: -35,                           / Algorithm                     /
  3: application/xml,               / Content type                  /
  4: h'aaa24a3e...275d4b7a',        / Key identifier                /
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
            h'83020181...27c0d3b5', / Inclusion proof 1             /
          ]
        },
      },
      h'',                          / Detached payload              /
      h'07ea9684...bc37e274'        / Signature                     /
    ]
)
~~~~

~~~~ cbor-diag
{                                   / Protected                     /
  1: -35,                           / Algorithm                     /
  4: h'aaa24a3e...275d4b7a',        / Key identifier                /
  -111: 1,                          / Verifiable Data Structure     /
  13: {                             / CWT Claims                    /
    1: urn:example:789,             / Issuer                        /
    2: urn:example:abc,             / Subject                       /
  }
}
~~~~

~~~~ cbor-diag
[                                   / Inclusion proof 1             /
  2,                                / Tree size                     /
  1,                                / Leaf index                    /
  [                                 / Inclusion hashes (1)          /
     h'defc4bbd...27c0d3b5'         / Intermediate hash 1           /
  ]
]
~~~~