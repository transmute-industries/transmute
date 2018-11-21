# Nested DID Spec

## Review of Existing Implementations

DID systems have at least 2 core cryptographic requirements.

1. Censorship resistent decentralized storage system

2. Cryptographic decentralized identity protocol

Some implementations such as Soverin and uPort combine these 2 requirements by leveraging a suite of cryptographic operations and infrastrucure technology to create DIDs that are of the following form:

`did:METHOD:IDENTIFIER`

Typically `METHOD` is tied to at least one decentralized content storage system such as blockchain or cryptographic file system, and the `IDENTIFIER` is a hash of a public key or a full public key.

## Nested Implementation

It is possible to create a valid DID implementation that is anchored by 2 public keys, one for updating the filesystem, the other for managing the integrity of the documents, identities and claims.

Transmute DID supports this second scenario with a specific DID syntax:

`did:storageKeyType.transmute.identityKeyType:storageKeyID.identityKeyID`


Here is an example using orbitdb and openpgp:

`did:orbitdb.transmute.openpgp:QmTjTQfsuSiMrMwzjLUZH4fgZAdmsML4aP1Ms6DTrhT4zb.6075f9ad86de29d7644752c95e7379e3e5e4a806`

The OrbitDB record for this identity:

```
{
  "orbitDID": "did:orbitdb.transmute.openpgp:QmTjTQfsuSiMrMwzjLUZH4fgZAdmsML4aP1Ms6DTrhT4zb.6075f9ad86de29d7644752c95e7379e3e5e4a806",
  "doc": {
    "_id": "did:transmute.openpgp:6075f9ad86de29d7644752c95e7379e3e5e4a806",
    "object": {
      "@context": "https://w3id.org/did/v1",
      "id": "did:transmute.openpgp:6075f9ad86de29d7644752c95e7379e3e5e4a806",
      "publicKey": [
        {
          "id": "did:transmute.openpgp:6075f9ad86de29d7644752c95e7379e3e5e4a806#99397de30ac7011ae098e0942168077fe5243869b5111c2dee96d4d55055cf51",
          "type": "Secp256k1VerificationKey2018",
          "owner": "did:transmute.openpgp:6075f9ad86de29d7644752c95e7379e3e5e4a806",
          "publicKeyPem": "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.2.1\r\nComment: https://openpgpjs.org\r\n\r\nxk8EW+2/QRMFK4EEAAoCAwRcJb/1TzuJOhKidOCNIB6bZLZ9wJmP0CCALUiQ\r\nSnCRMsY+V75Me9T74DeCJvn/LvgpbxeIreJ/nddxE7pxIJv+zQh0ZXN0LWtl\r\necJ3BBATCAAfBQJb7b9BBgsJBwgDAgQVCAoCAxYCAQIZAQIbAwIeAQAKCRBe\r\nc3nj5eSoBkSeAP9cCJyT5Y8veQON+1gc3iciymMTaV5FUqgH3DBmHYJ3+gEA\r\n6qvb7qOH7I0YEMpzgYMNblS8GcaLwIsEbpyTbOfeog/OUwRb7b9BEgUrgQQA\r\nCgIDBAG1wZ23+Gw517yYRXN/xIMYeqRbnolkW+gdvyk1edhm0KqYc2AMjqfR\r\n9447c6FJ/i5jFrvqhs1ZI9fedDb7dukDAQgHwmEEGBMIAAkFAlvtv0ECGwwA\r\nCgkQXnN54+XkqAYwFAD/dNeNPeYWlFWIt2oNZYGufJiHLQtPee/s/7BpJlLN\r\n7AMA/2/0M/vwONA58pHCT6fb6/iQmHczSLrBo/nckxA7zhG2\r\n=wnW5\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n"
        },
        {
          "id": "did:transmute.openpgp:6075f9ad86de29d7644752c95e7379e3e5e4a806#ea80153b192aad477d9f1faab5976af16071657b28df2d394ad216138b71388c",
          "type": "Secp256k1VerificationKey2018",
          "owner": "did:transmute.openpgp:6075f9ad86de29d7644752c95e7379e3e5e4a806",
          "publicKeyHex": "044ae395f44339e7838c406e127791c149dada742fd9674e64125fb07b15bda5e1dcbd8ff4042af018404da79f22a3895fae7aaf528e3c445e193324a026afe670"
        }
      ],
      "authentication": [
        {
          "publicKey": "did:transmute.openpgp:6075f9ad86de29d7644752c95e7379e3e5e4a806#99397de30ac7011ae098e0942168077fe5243869b5111c2dee96d4d55055cf51",
          "type": "Secp256k1VerificationKey2018"
        },
        {
          "publicKey": "did:transmute.openpgp:6075f9ad86de29d7644752c95e7379e3e5e4a806#ea80153b192aad477d9f1faab5976af16071657b28df2d394ad216138b71388c",
          "type": "Secp256k1VerificationKey2018"
        }
      ]
    },
    "signature": "-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.2.1\r\nComment: https://openpgpjs.org\r\n\r\nwl4EARMIAAYFAlvt1+oACgkQXnN54+XkqAYvwAD9GcYOmQSSA6+mcx94nNoS\r\nrmjI34TjSorGbKPU5x/5erwBAPw+4o55LSXYBYjgRyUhFv6dJi5bsNlcNAu+\r\n0XuKzzw1\r\n=AXRc\r\n-----END PGP SIGNATURE-----\r\n",
    "meta": {
      "version": "openpgp@^4.0.1",
      "kid": "99397de30ac7011ae098e0942168077fe5243869b5111c2dee96d4d55055cf51"
    }
  },
  "hash": "Qmc6nUrz3Ry5vAKKuSdMN95owShfESuFYR54nRHGCJfnDB"
}
```

This DID's wallet: 

```
{
  "version": "1.0.0-alpha.1",
  "salt": "d2acfdb56799bf46c5250ee1ba8b4f9a",
  "keystore": {
    "99397de30ac7011ae098e0942168077fe5243869b5111c2dee96d4d55055cf51": {
      "kid": "99397de30ac7011ae098e0942168077fe5243869b5111c2dee96d4d55055cf51",
      "data": {
        "publicKey": "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.2.1\r\nComment: https://openpgpjs.org\r\n\r\nxk8EW+2/QRMFK4EEAAoCAwRcJb/1TzuJOhKidOCNIB6bZLZ9wJmP0CCALUiQ\r\nSnCRMsY+V75Me9T74DeCJvn/LvgpbxeIreJ/nddxE7pxIJv+zQh0ZXN0LWtl\r\necJ3BBATCAAfBQJb7b9BBgsJBwgDAgQVCAoCAxYCAQIZAQIbAwIeAQAKCRBe\r\nc3nj5eSoBkSeAP9cCJyT5Y8veQON+1gc3iciymMTaV5FUqgH3DBmHYJ3+gEA\r\n6qvb7qOH7I0YEMpzgYMNblS8GcaLwIsEbpyTbOfeog/OUwRb7b9BEgUrgQQA\r\nCgIDBAG1wZ23+Gw517yYRXN/xIMYeqRbnolkW+gdvyk1edhm0KqYc2AMjqfR\r\n9447c6FJ/i5jFrvqhs1ZI9fedDb7dukDAQgHwmEEGBMIAAkFAlvtv0ECGwwA\r\nCgkQXnN54+XkqAYwFAD/dNeNPeYWlFWIt2oNZYGufJiHLQtPee/s/7BpJlLN\r\n7AMA/2/0M/vwONA58pHCT6fb6/iQmHczSLrBo/nckxA7zhG2\r\n=wnW5\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n",
        "privateKey": "-----BEGIN PGP PRIVATE KEY BLOCK-----\r\nVersion: OpenPGP.js v4.2.1\r\nComment: https://openpgpjs.org\r\n\r\nxaIEW+2/QRMFK4EEAAoCAwRcJb/1TzuJOhKidOCNIB6bZLZ9wJmP0CCALUiQ\r\nSnCRMsY+V75Me9T74DeCJvn/LvgpbxeIreJ/nddxE7pxIJv+/gkDCDH4RRT4\r\nE99b4LcBQmuibj8oa7TbS48c49rbAtSXXei76iXBQhwCdk1hR0K1z0sfJdka\r\nDsqW5YKttOOBg/Yq6Am3blj6SOwAa3/oKqp8KVrNCHRlc3Qta2V5wncEEBMI\r\nAB8FAlvtv0EGCwkHCAMCBBUICgIDFgIBAhkBAhsDAh4BAAoJEF5zeePl5KgG\r\nRJ4A/1wInJPljy95A437WBzeJyLKYxNpXkVSqAfcMGYdgnf6AQDqq9vuo4fs\r\njRgQynOBgw1uVLwZxovAiwRunJNs596iD8emBFvtv0ESBSuBBAAKAgMEAbXB\r\nnbf4bDnXvJhFc3/Egxh6pFueiWRb6B2/KTV52GbQqphzYAyOp9H3jjtzoUn+\r\nLmMWu+qGzVkj1950Nvt26QMBCAf+CQMIYP5+waCu4ofgje4rpySi5OrQmlP7\r\ndEccpK9TvLf8qeDm68/gfmZiKyZhq/c9Z+RcpY8nzWP6ikt+5G40fLv/eAjM\r\nxUOBS6oMEvn3xOX+oMJhBBgTCAAJBQJb7b9BAhsMAAoJEF5zeePl5KgGMBQA\r\n/3TXjT3mFpRViLdqDWWBrnyYhy0LT3nv7P+waSZSzewDAP9v9DP78DjQOfKR\r\nwk+n2+v4kJh3M0i6waP53JMQO84Rtg==\r\n=6rUI\r\n-----END PGP PRIVATE KEY BLOCK-----\r\n"
      },
      "type": "assymetric",
      "meta": {
        "version": "openpgp@^4.0.1",
        "tags": [
          "OpenPGP.js",
          "macbook pro"
        ],
        "notes": "created for testing purposes",
        "did": {
          "publicKey": true,
          "authentication": true,
          "publicKeyType": "publicKeyPem",
          "signatureType": "Secp256k1VerificationKey2018"
        }
      }
    },
    "ea80153b192aad477d9f1faab5976af16071657b28df2d394ad216138b71388c": {
      "kid": "ea80153b192aad477d9f1faab5976af16071657b28df2d394ad216138b71388c",
      "data": {
        "publicKey": "044ae395f44339e7838c406e127791c149dada742fd9674e64125fb07b15bda5e1dcbd8ff4042af018404da79f22a3895fae7aaf528e3c445e193324a026afe670",
        "privateKey": "a6574e23c60bbf9e55fa2f6eef9ee1c3f91652d0ab7421dad3899f496108e86f"
      },
      "type": "assymetric",
      "meta": {
        "version": "elliptic@^6.4.1",
        "tags": [
          "OrbitDB",
          "macbook pro"
        ],
        "notes": "created for testing purposes",
        "did": {
          "publicKey": true,
          "authentication": true,
          "publicKeyType": "publicKeyHex",
          "signatureType": "Secp256k1VerificationKey2018"
        }
      }
    }
  }
}
```

An example signature from this DID:

```
{
  "address": "/orbitdb/QmTjTQfsuSiMrMwzjLUZH4fgZAdmsML4aP1Ms6DTrhT4zb/did:transmute.openpgp:6075f9ad86de29d7644752c95e7379e3e5e4a806",
  "did": "did:orbitdb.transmute.openpgp:QmTjTQfsuSiMrMwzjLUZH4fgZAdmsML4aP1Ms6DTrhT4zb.6075f9ad86de29d7644752c95e7379e3e5e4a806",
  "storeObject": {
    "object": {
      "subject": "did:orbitdb.transmute.openpgp:QmTjTQfsuSiMrMwzjLUZH4fgZAdmsML4aP1Ms6DTrhT4zb.6075f9ad86de29d7644752c95e7379e3e5e4a806",
      "claims": {
        "isTruckDriver": true,
        "isInvestor": true,
        "isDoctor": false
      }
    },
    "signature": "-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nwl4EARMIABAFAlvu+McJEF5zeePl5KgGAABQpQEAuZF+jpbAxNzPlLhuwuUz\nJ+W8+q8F7VQHo//OGiE4ImsBANlCptfhxdiCPqfvMvDwdKfmNpEY3zevebbC\n+P5lq84O\r\n=OG6p\r\n-----END PGP SIGNATURE-----\r\n",
    "meta": {
      "version": "openpgp@^4.0.1",
      "kid": "did:orbitdb.transmute.openpgp:QmTjTQfsuSiMrMwzjLUZH4fgZAdmsML4aP1Ms6DTrhT4zb.6075f9ad86de29d7644752c95e7379e3e5e4a806#99397de30ac7011ae098e0942168077fe5243869b5111c2dee96d4d55055cf51"
    }
  },
  "signatureID": "0x97f9ef48f47c48f97e269dda8d5553985c63f3716c011ddd210fe34bf1250827"
}
```

This construction is made possible by a symmetric transformation function between orbit db addresses and DIDs, as well as the fact that orbit db addresses are deterministic functions of the access control (list of public keys) and database type and name.

[Learn more about Orbit DB Addresses](https://github.com/orbitdb/orbit-db/blob/master/GUIDE.md#address)

The trust in such a DID implementation relies on the confidentiality of both `storageKey` and `identityKey`. 

If an attacker compromises `storageKey`, they can alter the filesystem, but without the `identityKey` they can only censor or DOS the system.

If an attacker compromises `identityKey`, they can alter the identity, but without the `storageKey` they can only impersonate the identity to external parties, they cannot update the documents or signature associated with it in the filesytem.

Consider the cases where a company or individual controls the `storageKey` and `identityKey`, we consider company control of a private key to be centralized, and personal control of a private key decentralized:


| Case              | Centralized Storage | Centralized Identity | Decentralized Storage | Decentralized Identity |
|-------------------|---------------------|----------------------|-----------------------|------------------------|
| Coinbase Wallet   | X                   | X                    |                       |                        |
| Enterprise Notary |                     | X                    | X                     |                        |
| Enterprise GDPR   | X                   |                      |                       | X                      |
| Personal Wallet   |                     |                      | X                     | X                      |

### Benefits

The same identity can be anchored to different storage systems, which may help in cases where updates to certain stronger storage systems are more expensive (such as blockchains).

The `identityKey` can support a different cryptographic suite than the `storageKey`, so RSA and EC can be combined. For example, this allows a legacy cryptographic identity to be made available over a modern decentralized storage interface.

