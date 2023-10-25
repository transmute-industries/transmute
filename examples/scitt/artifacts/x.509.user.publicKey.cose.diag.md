~~~~ cbor-diag
{                                   / COSE Key                      /
  1: 2,                             / Type                          /
  2: h'75726e3a...4b755a59',        / Identifier                    /
  3: -35,                           / Algorithm                     /
  -1: 2,                            / Curve                         /
  -2: h'445169ee...498a53f1',       / x public key component        /
  -3: h'0c2469cb...7e9dfd69',       / y public key component        /
  -66666: [                         / X.509 Certificate Chain       /
    h'308201b4...b4e9b233',         / X.509 Certificate             /
    h'308201bf...4eb5f42d',         / X.509 Certificate             /
  ]
}
~~~~