## Revocation of a DID

[W3C DID Revocation Reference](https://w3c-ccg.github.io/did-spec/#delete-revoke)

DID Revocation should be handled with a `revocationCert` property in the DID Document.

When present it must be a json object signed by the DID Root Key, formatted like so:

```
{
  "object": {
    "publicKey": "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxk8EW+sYmRMFK4EEAAoCAwQgn6FzXRZot68Pudbhd1zXxc8loBPpqFmuli9f\nsa6xeTNFjY9IhOAGr0HQNEKh4DhyuIoHf0CTtkzKBEHECK4mzQh0ZXN0LWtl\necJ3BBATCAApBQJb6xiZBgsJBwgDAgkQcC0BOMNJygQEFQgKAgMWAgECGQEC\nGwMCHgEAAFAyAP9gy5LEX/24+YA1o7Hc5mLfWvsx/fpU48xCKd8JD22TPwEA\n3Fgf3c0NvoF0UxfR5ldDSvTvp+jrw5gvueZTzHlmNOPOUwRb6xiZEgUrgQQA\nCgIDBDtD+1QEekxkg8yU83fN+nMFAOgLOm2KKxhGxypyPZJgubSEk5J1kFrG\nQtu11L9Afo3QIezx0/iKKnv8sMDupkUDAQgHwmEEGBMIABMFAlvrGJkJEHAt\nATjDScoEAhsMAABFvwEA3Xr3daeZThSbNEklVtrOvC3Um9gXZsqHDEELF2rF\nzCUA/RkscQMeVcd6AH8f3Vl6SneXiY9qTgJfD6NAP0qMYsEo\r\n=8g9/\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n\r\n",
    "message": "This signed json object serves as a revocation certificate for did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04. See https://docs.transmute.industries/did/revocation for more information.",
    "timestampUTC": "2018-11-26T16:35:01.203Z"
  },
  "signature": "-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nwl4EARMIABAFAlv8ILUJEHAtATjDScoEAADG0gEA5e/Tm0mwTW7clOJmyYOM\niYzWCuy3DI0OVDw6VxduT18A/jtUyl/XKTxzG0ssFjMzdzKF5amOlh5oWZO5\nKEcJN6ey\r\n=qrsh\r\n-----END PGP SIGNATURE-----\r\n",
  "meta": {
    "version": "openpgp@^4.0.1",
    "kid": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04#kid=2c4e730145b89cfebc1a0a16c64ccfa297277c2f136cfff8269b6bbfbaa3e178"
  }
}
```

Once present in the Document, it is invalid to make further updates to the Document. 

A revocationCert is a DID Document, with a signed json object property. The cert should never be handled by itself. This is why the full document is returned by the create revocationCert call.

DID Resolvers should always resolve a revoked DID Document, and when a cert is present, they should validate it before returning the document as is.



## Revocation of a DID Key

[W3C DID Key Revocation Reference](https://w3c-ccg.github.io/did-spec/  #key-revocation-and-recovery)