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