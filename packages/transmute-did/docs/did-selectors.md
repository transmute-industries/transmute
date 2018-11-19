# DID Selectors

Consider the case of a direct reference to a specific publicKey in a DID Document.

https://w3c-ccg.github.io/did-spec/#ex-6-various-public-keys

The `id` format described in the spec is the following:

`"id": "did:example:123456789abcdefghi#keys-2",`

There are a number of disadvantages of this approach:

- positional references may change
- url fragment is not a template URI (less expressive)
- `keys` is not a defined field in the spec.

DID Methods can be more restrictive regarding fragments:

https://w3c-ccg.github.io/did-spec/#fragments

In order to improve the usability of `id` field, we suggest the adoption of some addional standards to support working with DIDs.

- [JSON Pointer (JSON Path)](https://tools.ietf.org/html/rfc6901)
- [JSON Path](http://jsonpath.com/)
- [JSON Path Expressions](https://goessner.net/articles/JsonPath/index.html#e2)
- [URI Template](https://tools.ietf.org/html/rfc6570)
- [Fragment Identifier](https://en.wikipedia.org/wiki/Fragment_identifier)

Example:

```
{
  "@context": "https://w3id.org/did/v1",
  "id": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04",
  "publicKey": [
    {
      "id": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04#kid.sha256=2c4e730145b89cfebc1a0a16c64ccfa297277c2f136cfff8269b6bbfbaa3e178",
      "type": "Secp256k1VerificationKey2018",
      "owner": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04",
      "publicKeyPem": "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxk8EW+sYmRMFK4EEAAoCAwQgn6FzXRZot68Pudbhd1zXxc8loBPpqFmuli9f\nsa6xeTNFjY9IhOAGr0HQNEKh4DhyuIoHf0CTtkzKBEHECK4mzQh0ZXN0LWtl\necJ3BBATCAApBQJb6xiZBgsJBwgDAgkQcC0BOMNJygQEFQgKAgMWAgECGQEC\nGwMCHgEAAFAyAP9gy5LEX/24+YA1o7Hc5mLfWvsx/fpU48xCKd8JD22TPwEA\n3Fgf3c0NvoF0UxfR5ldDSvTvp+jrw5gvueZTzHlmNOPOUwRb6xiZEgUrgQQA\nCgIDBDtD+1QEekxkg8yU83fN+nMFAOgLOm2KKxhGxypyPZJgubSEk5J1kFrG\nQtu11L9Afo3QIezx0/iKKnv8sMDupkUDAQgHwmEEGBMIABMFAlvrGJkJEHAt\nATjDScoEAhsMAABFvwEA3Xr3daeZThSbNEklVtrOvC3Um9gXZsqHDEELF2rF\nzCUA/RkscQMeVcd6AH8f3Vl6SneXiY9qTgJfD6NAP0qMYsEo\r\n=8g9/\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n\r\n"
    },
...
```

Here we propose the format of the id property leverage a valid did fragment:

`${did}#kid.sha256=${sha256(publicKeyPem | publicKeyHex)}`

Reasons:

- Leverage sha256 to create a deterministic algorithm for checking to see if a given publicKey is in a did document.
- Built in integrity checking for keys.
- support for alternative hash functions in the future.
- easy integration with legacy keystores

It is possible to reference the same key using a positional index and a json path

`$.publicKey[0]` - get the first publicKeys

`$.publicKey[:2]` - get the first 2 publicKeys


Or by type

`$.publicKey[?(@.type=='Secp256k1VerificationKey2018')]`

Or by id
`$.publicKey[?(@.id=='did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04#kid.sha256=5c51560bcef78d176b726a00b27ad3ef533ae39ef3d0f514392c79988c40d220')]`

