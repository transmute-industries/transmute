~~~~ cbor-diag
18(                                 / COSE Single Signer Data Object        /
    [
      h'a2012604...6d706c65',       / Protected header                      /
      {                             / Unprotected header                    /
        100: [                      / Inclusion proofs (2)                  /
          h'83040282...1f487bb1',   / Inclusion proof 1                     /
          h'83040382...1f487bb1',   / Inclusion proof 2                     /
        ]
      },
      h'',                          / Payload                               /
      h'efde9a59...b4cb142b'        / Signature                             /
    ]
)
~~~~

~~~~ cbor-diag
{                                   / Protected header                      /
  1: -7,                            / Cryptographic algorithm to use        /
  4: h'68747470...6d706c65'         / Key identifier                        /
}
~~~~

~~~~ cbor-diag
[                                   / Inclusion proof 1                     /
  4,                                / Tree size                             /
  2,                                / Leaf index                            /
  [                                 / Inclusion hashes (2)                  /
     h'a39655d4...d29a968a'         / Intermediate hash 1                   /
     h'57187dff...1f487bb1'         / Intermediate hash 2                   /
  ]
]
~~~~

~~~~ cbor-diag
[                                   / Inclusion proof 2                     /
  4,                                / Tree size                             /
  3,                                / Leaf index                            /
  [                                 / Inclusion hashes (2)                  /
     h'e7f16481...aab81688'         / Intermediate hash 1                   /
     h'57187dff...1f487bb1'         / Intermediate hash 2                   /
  ]
]
~~~~