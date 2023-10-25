~~~~ cbor-diag
18(                                 / COSE Sign 1                   /
    [
      h'a4013822...3a313233',       / Protected                     /
      {},                           / Unprotected                   /
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