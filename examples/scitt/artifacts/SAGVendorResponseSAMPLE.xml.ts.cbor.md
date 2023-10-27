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