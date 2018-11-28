## Revocation of a DID

[W3C DID Revocation Reference](https://w3c-ccg.github.io/did-spec/#delete-revoke)

Because revocation of a DID requires control over the private key, recovery from loss or theft of private key must be addressed before revocation is possible.

[Transmute DID Recovery](./recovery.md)

We now assume an attacker can steal a key, but the user will always retain the ability to sign with a given private key (user private keys are recoverable).

DID Revocation should be handled with a `revocationCert` property in the DID Document.

When present it must be a json object signed by the DID Root Key, formatted like so:

```
{
  "@context": "https://w3id.org/did/v1",
    "id": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04",
    "revocationCert": {
      "object": {
        "publicKey": "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxk8EW+sYmRMFK4EEAAoCAwQgn6FzXRZot68Pudbhd1zXxc8loBPpqFmuli9f\nsa6xeTNFjY9IhOAGr0HQNEKh4DhyuIoHf0CTtkzKBEHECK4mzQh0ZXN0LWtl\necJ3BBATCAApBQJb6xiZBgsJBwgDAgkQcC0BOMNJygQEFQgKAgMWAgECGQEC\nGwMCHgEAAFAyAP9gy5LEX/24+YA1o7Hc5mLfWvsx/fpU48xCKd8JD22TPwEA\n3Fgf3c0NvoF0UxfR5ldDSvTvp+jrw5gvueZTzHlmNOPOUwRb6xiZEgUrgQQA\nCgIDBDtD+1QEekxkg8yU83fN+nMFAOgLOm2KKxhGxypyPZJgubSEk5J1kFrG\nQtu11L9Afo3QIezx0/iKKnv8sMDupkUDAQgHwmEEGBMIABMFAlvrGJkJEHAt\nATjDScoEAhsMAABFvwEA3Xr3daeZThSbNEklVtrOvC3Um9gXZsqHDEELF2rF\nzCUA/RkscQMeVcd6AH8f3Vl6SneXiY9qTgJfD6NAP0qMYsEo\r\n=8g9/\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n\r\n",
        "message": "This signed json object serves as a revocation certificate for did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04. See https://docs.transmute.industries/did/revocation for more information.",
        "timestampUTC": "2018-11-26T19:55:07.067Z"
      },
      "signature": "-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nwl4EARMIABAFAlv8T5sJEHAtATjDScoEAADrXwD9H58jSW6ZXN9wRBgG5Bxe\ns87HTVvp2g6g/ROuTT9JwwYBAPL8r5irTAeL+sK1D/EnCPv+u0B/x5ORwzSe\ngXNvW2EG\r\n=EL9c\r\n-----END PGP SIGNATURE-----\r\n",
      "meta": {
        "version": "openpgp@^4.0.1",
        "kid": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04#kid=2c4e730145b89cfebc1a0a16c64ccfa297277c2f136cfff8269b6bbfbaa3e178"
      }
    },
    "publicKey": [
      {
        "id": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04#kid=2c4e730145b89cfebc1a0a16c64ccfa297277c2f136cfff8269b6bbfbaa3e178",
        "type": "Secp256k1VerificationKey2018",
        "owner": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04",
        "publicKeyPem": "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxk8EW+sYmRMFK4EEAAoCAwQgn6FzXRZot68Pudbhd1zXxc8loBPpqFmuli9f\nsa6xeTNFjY9IhOAGr0HQNEKh4DhyuIoHf0CTtkzKBEHECK4mzQh0ZXN0LWtl\necJ3BBATCAApBQJb6xiZBgsJBwgDAgkQcC0BOMNJygQEFQgKAgMWAgECGQEC\nGwMCHgEAAFAyAP9gy5LEX/24+YA1o7Hc5mLfWvsx/fpU48xCKd8JD22TPwEA\n3Fgf3c0NvoF0UxfR5ldDSvTvp+jrw5gvueZTzHlmNOPOUwRb6xiZEgUrgQQA\nCgIDBDtD+1QEekxkg8yU83fN+nMFAOgLOm2KKxhGxypyPZJgubSEk5J1kFrG\nQtu11L9Afo3QIezx0/iKKnv8sMDupkUDAQgHwmEEGBMIABMFAlvrGJkJEHAt\nATjDScoEAhsMAABFvwEA3Xr3daeZThSbNEklVtrOvC3Um9gXZsqHDEELF2rF\nzCUA/RkscQMeVcd6AH8f3Vl6SneXiY9qTgJfD6NAP0qMYsEo\r\n=8g9/\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n\r\n"
      },
      {
        "id": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04#kid=96f51708b7f2b17f23e8d96f0559a2a4235554d4963aea6996f1484c310e4b6a",
        "type": "Secp256k1VerificationKey2018",
        "owner": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04",
        "publicKeyHex": "5b767b4fcf8664e3e4c32dd41d5b4c3b88680c10946e063e4100d3c7484a563b99576ba1de98cb77366ecafd47730ed5830a6c3e7faed48010b49532d0b01585"
      },
      {
        "id": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04#kid=5c51560bcef78d176b726a00b27ad3ef533ae39ef3d0f514392c79988c40d220",
        "type": "Secp256k1VerificationKey2018",
        "owner": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04",
        "publicKeyHex": "04c44cb158a11cd03f30b713276faf8cf8869fccb2a48662dc43fcde61af5008040270257a3734f47acbb1bf2def85b7a4c0d213ab634bc2e79dbc4c1916d45a4f"
      },
      {
        "id": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04#kid=c541a06014170f7e85383f13e95f2bf45da28473daa241fc2f21b16461efdec2",
        "type": "Ed25519VerificationKey2018",
        "owner": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04",
        "publicKeyHex": "0dd352b917fe90926c3ac045d91c37bdcc22e2ca90e0cc3b3409be8ceda936a6"
      }
    ],
    "authentication": [
      {
        "publicKey": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04#kid=2c4e730145b89cfebc1a0a16c64ccfa297277c2f136cfff8269b6bbfbaa3e178",
        "type": "Secp256k1VerificationKey2018"
      },
      {
        "publicKey": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04#kid=96f51708b7f2b17f23e8d96f0559a2a4235554d4963aea6996f1484c310e4b6a",
        "type": "Secp256k1VerificationKey2018"
      },
      {
        "publicKey": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04#kid=5c51560bcef78d176b726a00b27ad3ef533ae39ef3d0f514392c79988c40d220",
        "type": "Secp256k1VerificationKey2018"
      },
      {
        "publicKey": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04#kid=c541a06014170f7e85383f13e95f2bf45da28473daa241fc2f21b16461efdec2",
        "type": "Ed25519VerificationKey2018"
      }
    ]
}
```

A revocationCert is a DID Document, with a signed json object property. The cert should never be handled by itself. This is why the full document is returned by the create revocationCert call.

DID Resolvers should always resolve a revoked DID Document, and when a cert is present, they should validate it before returning the document as is.

Once present in the Document, it is invalid to make further updates to the Document. 

It should be noted that an attacker with a stolen private key can generate additional signatures after a did has been revoked. These signatures will not be ignored by a decentralized system at the protocol layer, and must be ignored at the app layer by honest clients. For example, a blockchain based DID will continue to emit events signed by the private key, but those events should be ignored by any client that is aware of an earlier revoked state for the DID. Similarly for decentralized storage systems, such as Orbit DB.

Because a stolen private key can be used to create a backdated revocation cert, and we don't want to force revocation certs to be created up front for all key types for compatability reasons, revocation certs require an additional expensive feature: they must be anchored to some immutable timestamp system, such as a blockchain.

Signatures before the anchor point are protected, signatures after the anchor point cannot be trusted.

In order for the anchor to be usable it must be publically resolvable to a revocationCert.

In the case of multiple anchor systems, the earliest anchor should be accepted.

## Revocation of a DID Key

[W3C DID Key Revocation Reference](https://w3c-ccg.github.io/did-spec/#key-revocation-and-recovery)