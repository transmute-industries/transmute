~~~~ cbor-diag
18(                                 / COSE Sign 1                   /
    [
      h'a4013822...3a313233',       / Protected                     /
      {                             / Unprotected                   /
        -333: [                     / Receipts (1)                  /
          h'd284584e...ae40199f'    / Receipt 1                     /
        ]
      },
      h'',                          / Detached payload              /
      h'6d3ee639...ccc45e93'        / Signature                     /
    ]
)
~~~~

~~~~ cbor-diag
{                                   / Protected                     /
  1: -35,                           / Algorithm                     /
  3: application/json,              / Content type                  /
  4: h'aaa24a3e...275d4b7a',        / Key identifier                /
  13: {                             / CWT Claims                    /
    1: urn:example:123,             / Issuer                        /
    2: urn:example:123,             / Subject                       /
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
            h'83010080',            / Inclusion proof 1             /
          ]
        },
      },
      h'',                          / Detached payload              /
      h'd657a947...ae40199f'        / Signature                     /
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
  1,                                / Tree size                     /
  0,                                / Leaf index                    /
  [                                 / Inclusion hashes (0)          /

  ]
]
~~~~