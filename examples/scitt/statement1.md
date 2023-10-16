~~~~ cbor-diag
18(                                 / COSE Single Signer Data Object        /
    [
      h'a3013822...6c61696e',       / Protected header                      /
      {},                           / Unprotected header                    /
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