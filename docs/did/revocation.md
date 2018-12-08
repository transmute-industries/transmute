## Revocation of a DID

[W3C DID Revocation Reference](https://w3c-ccg.github.io/did-spec/#delete-revoke)

Because revocation of a DID requires control over the private key, recovery from loss or theft of private key must be addressed before revocation is possible.

[Transmute DID Recovery](./recovery.md)

We now assume an attacker can steal a key, but the user will always retain the ability to sign with a given private key (user private keys are recoverable). An attacker will also retain the ability to sign, which creates a problem when attempting to anchor the signature to a blockchain, the attacker can drain the funds from the account such that the victim is never able to complete a transaction. Lets avoid this case for now, it can be solved by delegated revocation (assuming the attacker does not compromise all delegates).

A revocation is a signature from a revocation key of a did publicKey id and timestamp. In resource constrained environments such as blockchains, it may be more compact, and timestamps may be located outside the signature (on the block).

When a revocation is issued outside of a blockchain it is always vulnerable to being backdated by an attacker. This can similiarly be handled by delegated revocation to a blockchain compatible key.

Here is an example revocation cert.

```
{
  "object": {
    "kid": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04#kid=2c4e730145b89cfebc1a0a16c64ccfa297277c2f136cfff8269b6bbfbaa3e178",
    "message": "This signed json object serves as a revocation certificate for did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04#kid=2c4e730145b89cfebc1a0a16c64ccfa297277c2f136cfff8269b6bbfbaa3e178. See https://docs.transmute.industries/did/revocation for more information.",
    "timestamp": 1543603811
  },
  "signature": "-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nwl4EARMIABAFAlwBhmMJEHAtATjDScoEAAAwVwEA0txvROFI0k8e1HWa3vGb\n3m2R+CNq+gU7JGZwOOaPhpkA/0I7nxmOnL8Wx1tmTSKco2n2/As0G0NKJjyb\ny9gBxJUc\r\n=Iy92\r\n-----END PGP SIGNATURE-----\r\n",
  "meta": {
    "version": "openpgp@^4.0.1",
    "kid": "did:transmute.openpgp:03c1c863029047a1dd0db583702d0138c349ca04#kid=2c4e730145b89cfebc1a0a16c64ccfa297277c2f136cfff8269b6bbfbaa3e178"
  }
}
```

<!-- https://w3c-ccg.github.io/did-spec/#public-keys -->

In order to determine if a publicKey in a DID Document is revoked, the `revocations` property should be checked.

If the `revocations` property is a DID, such as an Orbit DB Address for example:

`/orbitdb/QmbYCZYwvRZ8GABPo4iiRoq3XDPd2T7ESZsHwiSYUmtbCC/revocations`

Then this resource will contain a list of all revoked keys. If the kid for this public key exists in the list, the key is revoked.

If the `revocations` property is a URL, such as:

`https://revocations.transmute-did.com/?contractAddress=0x123...&did=did:transmute.openpgp:03c1...&kid=2c4e7301...`

Then the ethereum contract `0x123...` will have emitted events signed by kid `2c4e7301...`, and if one of those events is this publicKey's kid, then the key is revoked. If multiple kid's are provided, a signature from any of them is sufficient to revoke the key (this allows for multiple delegated revocation).

It should be noted that an unresolveable kid is assumed to be revoked (removing a key from a document is also a form of revocation). 

It is best to revoke the key according to the `revocations` property before removing it.

Note that the revocation will no longer be verifiable if the publicKey is removed, yet the publicKey is still revoked.

### Signatures from revoked keys

A revoked key which is still listed should simply result in a warning to the client, that although the signature is valid, it should maybe not be trusted because the key has been revoked.

A revoked key which is removed from a DID document should cause DID signature verifcation error (because the public key is no longer listed, signature will not be verified).

### Revoking a DID

Resolve the DID to the DID Document, and check the proof property. Look at the revocations property for the proof key.

If the proof key is revoked the DID is revoked.

If the proof is a list, all the keys listed must be revoked for the did to be revoked.

Once a DID has been revoked, it is invalid to make further updates to the DID Document.

It should be noted that an attacker with a stolen private key can generate additional signatures after a did has been revoked. These signatures will not be ignored by a decentralized system at the protocol layer, and must be ignored at the app layer by honest clients. For example, a blockchain based DID will continue to emit events signed by the private key, but those events should be ignored by any client that is aware of an earlier revoked state for the DID. Similarly for decentralized storage systems, such as Orbit DB.

Because a stolen private key can be used to create a backdated revocation cert, and we don't want to force revocation certs to be created up front for all key types for compatability reasons, it is advisable to delegate revocation to blockchain compatible keys (use ethereum to revoke your PGP keys in your DID).
