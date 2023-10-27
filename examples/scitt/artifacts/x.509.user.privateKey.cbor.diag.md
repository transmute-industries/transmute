~~~~ cbor-diag
{                                   / COSE Key                      /
  1: 2,                             / Type                          /
  2: h'75726e3a...32636573',        / Identifier                    /
  3: -35,                           / Algorithm                     /
  -1: 2,                            / Curve                         /
  -2: h'f9754dbf...0001e040',       / x public key component        /
  -3: h'c1fe17d9...56e0822f',       / y public key component        /
  -4: h'329aa11e...f90f5dc9',       / d private key component       /
  -66666: [                         / X.509 Certificate Chain       /
    h'308201b4...f55dda17',         / X.509 Certificate             /
    h'308201c0...90680d74',         / X.509 Certificate             /
  ],
}
~~~~