# DID Cryptographic Assumptions

The `transmute-did` library makes use of a number of cryptographic libraries, and relies on these libraries for the strength of its operations.

At a high level, the core operation of `transmute-did` involves using a wallet json data structure to store private keys used for signing of json data. 

The library supports a number of digitial signature methods, including `libsodium-wrappers` and `openpgp.js`, as well as others.

We assume that these libraries are sound, and have no vulnerabilities in their implementation of their various cryptographic operations. 

We will now define a simple flow using `transmute-did` that can be used to support authentication of a DID assuming that the DID Document is resolvable. Note that resolution does not necessarily need to be other decentralized infrastructure, alough such implementations will lack the censorship resistance and self sovereign identity strengths.

## Creating a Wallet

A wallet is a json structure which holds keys. Wallets are protected with a password, key derivation function and symmetric encryption.

We generate a symmetric key using a public salt and the password provided by the user:

```
sodium.to_hex(
    sodium.crypto_pwhash(
      sodium.crypto_box_SEEDBYTES,
      password,
      sodium.from_hex(salt),
      sodium.crypto_pwhash_OPSLIMIT_MIN,
      sodium.crypto_pwhash_MEMLIMIT_MIN,
      sodium.crypto_pwhash_ALG_DEFAULT,
    ),
  );
```

[Read More](https://libsodium.gitbook.io/doc/password_hashing)
[Our Code](https://github.com/transmute-industries/transmute/blob/master/packages/transmute-did/src/lib/cryptoSuites/sodiumExtensions/index.js#L66)

We use this key to encrypt the wallet json which contains private keys, symmetric keys, key shares, or other senstive information which should never be written to disk in plaintext.

```
const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const encrypted = sodium.crypto_secretbox_easy(
    data,
    nonce,
    sodium.from_hex(key),
  );
```

[Read More](https://libsodium.gitbook.io/doc/secret-key_cryptography)
[Our Code](https://github.com/transmute-industries/transmute/blob/master/packages/transmute-did/src/lib/cryptoSuites/sodiumExtensions/index.js#L88)

Wallets can be decrypted, when access to keys is required. They should never be stored in plaintext.

## Create a DID Document

> Decentralized Identifiers (DIDs) are a new type of identifier for verifiable, "self-sovereign" digital identity. DIDs are fully under the control of the DID subject, independent from any centralized registry, identity provider, or certificate authority. DIDs are URLs that relate a DID subject to means for trustable interactions with that subject. DIDs resolve to DID Documents — simple documents that describe how to use that specific DID. Each DID Document contains at least three things: cryptographic material, authentication suites, and service endpoints. Cryptographic material combined with authentication suites provide a set of mechanisms to authenticate as the DID subject (e.g., public keys, pseudonymous biometric protocols, etc.). Service endpoints enable trusted interactions with the DID subject.
>
> This document specifies a common data model, format, and operations that all DIDs support.

[Read More](https://w3c-ccg.github.io/did-spec/)

Transmute DID does not have opinions about where you store your DID Document, what technologies you use to do so, etc. In order to use `transmute-did` to build a valid DID Method, you MUST ensure that a document resolved from an identifier has the corrent id property. `transmute-did` does support signing the DID Document as described in the spec. See [binding-of-identity](https://w3c-ccg.github.io/did-spec/#binding-of-identity).

Here is a DID Document produced from `transmute-did` that uses OrbitDB to help with document resolution and storage:

```
{
  "@context": "https://w3id.org/did/v1",
  "id": "did:orbitdb.transmute.openpgp:QmZ5ymeGirf41jNai6YsFYSGw2upCy2y41E7WEQnY2GG8z.38e6ed554af8c1da5ee9eb81d8b7399b955f6ffe",
  "publicKey": [
    {
      "id": "did:orbitdb.transmute.openpgp:QmZ5ymeGirf41jNai6YsFYSGw2upCy2y41E7WEQnY2GG8z.38e6ed554af8c1da5ee9eb81d8b7399b955f6ffe#kid=69dec37005c2df5414e356d8269ff79cdca772e7f57438ea35d35850c82f3e1e",
      "type": "Secp256k1VerificationKey2018",
      "owner": "did:orbitdb.transmute.openpgp:QmZ5ymeGirf41jNai6YsFYSGw2upCy2y41E7WEQnY2GG8z.38e6ed554af8c1da5ee9eb81d8b7399b955f6ffe",
      "revocations": "/orbitdb/QmXecs3KW51MvHnH2qzN19gu5fmEtkoU5KwvGavoHEedXM/revocations",
      "publicKeyPem": "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nxk8EW/coshMFK4EEAAoCAwT3Om3h2BBBY5W80KBE6MdQhYPAfSeUW8XoluvB\neyDQBV49WeAj1IA5HM+VOZhdc4nbOj98R0Ef3Ki11rurGm5MzQh0ZXN0LWtl\necJ3BBATCAApBQJb9yiyBgsJBwgDAgkQ2Lc5m5Vfb/4EFQgKAgMWAgECGQEC\nGwMCHgEAAKBQAQCR1AqE7Z41wGaArR+PUzspoyuYu1I8Ne5SpuY5jVlgaQEA\n0NDz5Dm9mQ5rgI2Jdrnq0TYH3vrhNdaugfzhDnlYjOHOUwRb9yiyEgUrgQQA\nCgIDBAnQM+84qvBafoux2fyXgNt/OrEXQs+X6uQx6b63MtmebnMPlBlBiMu2\nKoQIi7MNaixhbxC42xE8e8JLURjYpGwDAQgHwmEEGBMIABMFAlv3KLIJENi3\nOZuVX2/+AhsMAADA8gEAldik6/Z8JJlbfJKjRpOUE1uieGKxGG3Kudabi80J\nlOQA/iUqKVWDLEcANaXKqHAOZeyefTfK6TY4S4/vQIdgt7DD\r\n=N/BE\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n\r\n"
    },
    {
      "id": "did:orbitdb.transmute.openpgp:QmZ5ymeGirf41jNai6YsFYSGw2upCy2y41E7WEQnY2GG8z.38e6ed554af8c1da5ee9eb81d8b7399b955f6ffe#kid=e95349e60571896fad39f77e1a4061239174250509730b4c19702ddd737a2d7d",
      "type": "Secp256k1VerificationKey2018",
      "owner": "did:orbitdb.transmute.openpgp:QmZ5ymeGirf41jNai6YsFYSGw2upCy2y41E7WEQnY2GG8z.38e6ed554af8c1da5ee9eb81d8b7399b955f6ffe",
      "revocations": "/orbitdb/QmXecs3KW51MvHnH2qzN19gu5fmEtkoU5KwvGavoHEedXM/revocations",
      "publicKeyHex": "043e82ae1c5056ece9e12f1fe036a5430eae6b5b6ea06e97ff9484042aaf1e9621efdb928e47f4cde38d5e8694951abe156e625a15eaae0af0e303d5a40e3fe7d6"
    }
  ],
  "authentication": [
    {
      "publicKey": "did:orbitdb.transmute.openpgp:QmZ5ymeGirf41jNai6YsFYSGw2upCy2y41E7WEQnY2GG8z.38e6ed554af8c1da5ee9eb81d8b7399b955f6ffe#kid=69dec37005c2df5414e356d8269ff79cdca772e7f57438ea35d35850c82f3e1e",
      "type": "Secp256k1VerificationKey2018"
    },
    {
      "publicKey": "did:orbitdb.transmute.openpgp:QmZ5ymeGirf41jNai6YsFYSGw2upCy2y41E7WEQnY2GG8z.38e6ed554af8c1da5ee9eb81d8b7399b955f6ffe#kid=e95349e60571896fad39f77e1a4061239174250509730b4c19702ddd737a2d7d",
      "type": "Secp256k1VerificationKey2018"
    }
  ],
  "proof": [
    {
      "type": "LinkedDataSignature2015",
      "created": "2018-12-10T21:01:20.420Z",
      "creator": "did:orbitdb.transmute.openpgp:QmZ5ymeGirf41jNai6YsFYSGw2upCy2y41E7WEQnY2GG8z.38e6ed554af8c1da5ee9eb81d8b7399b955f6ffe#kid=69dec37005c2df5414e356d8269ff79cdca772e7f57438ea35d35850c82f3e1e",
      "signatureValue": "-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nwl4EARMIABAFAlwO1CAJENi3OZuVX2/+AABqEQEAkU13FBeK9wWuQFQDz/p5\nbLRtajWvkO3DKJYKn8SegtYA/RyMnlTw8+NqGBd4/KQLSq1OvAj2ZCzU0kOk\n2mjKiXYT\r\n=0xAJ\r\n-----END PGP SIGNATURE-----\r\n",
      "nonce": "13fbc7c484b1931a4a72101476da24e9",
      "domain": "wallet",
      "meta": {
        "version": "openpgp@^4.0.1",
        "kid": "did:orbitdb.transmute.openpgp:QmZ5ymeGirf41jNai6YsFYSGw2upCy2y41E7WEQnY2GG8z.38e6ed554af8c1da5ee9eb81d8b7399b955f6ffe#kid=69dec37005c2df5414e356d8269ff79cdca772e7f57438ea35d35850c82f3e1e"
      }
    }
  ]
}
```

In this example the integrity of the DID document is protected by the Orbit DB Protocol as well as the attached proof (PGP Signature).

`transmute-did` supports detached signatures and verification of detached signatures. The specific algorithms used produce and verify signature can vary, but we rely on the underlying library to perform these operations. Here are some examples using `libsodium-wrappers` and `openpgp.js`.


#### libsodium

```
sodium.to_hex(
    sodium.crypto_sign_detached(message, sodium.from_hex(privateKey)),
  );
```

```
sodium.crypto_sign_verify_detached(
    sodium.from_hex(signature),
    message,
    sodium.from_hex(publicKey),
  );
```

[Read More](https://libsodium.gitbook.io/doc/public-key_cryptography)
[Our Code](https://github.com/transmute-industries/transmute/blob/master/packages/transmute-did/src/lib/cryptoSuites/sodiumExtensions/index.js#L156)

#### openpgp.js

```
const sign = async ({ message, privateKey, passphrase }) => {
  const privKeyObj = (await openpgp.key.readArmored(privateKey)).keys[0];
  await privKeyObj.decrypt(passphrase);

  const options = {
    message: openpgp.cleartext.fromText(message), // CleartextMessage or Message object
    privateKeys: [privKeyObj], // for signing
  };

  return new Promise((resolve) => {
    openpgp.sign(options).then((signed) => {
      const cleartext = signed.data; // '-----BEGIN PGP SIGNED MESSAGE ... END PGP SIGNATURE-----'
      resolve(cleartext);
    });
  });
};
```

```
const verify = async ({ message, publicKey }) => {
  const options = {
    message: await openpgp.cleartext.readArmored(message), // parse armored message
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys, // for verification
  };

  return new Promise((resolve) => {
    openpgp.verify(options).then((verified) => {
      const validity = verified.signatures[0].valid; // true
      resolve(validity);
    });
  });
};
```

[Our Code](https://github.com/transmute-industries/transmute/blob/master/packages/transmute-did/src/lib/cryptoSuites/openpgpExtensions/cryptoHelpers/index.js#L104)

* _openpgp.js key's are assumed to be protected by a passphrase. This addional layer of security is assumed for compatability reasons. This behavior is unique to openpgp.js signatures._

With the ability to resolve a DID to a DID Document and verify signatures we have the necessary PKI to support signature based authentication flows. 

## DID Authentication

Lets look at a simple challenge response flow for authenticating a DID.

Lets say Alice and Bob meet at a party, and both have DIDs which are resolvable (who cares how).

Alice claims to be `did:test:123` and Bob claims to be `did:test:456`. They want to be able to use PGP, but they don't trust eachother's keys yet.

Alice can send bob a message that looks roughly like this:

"Hey bob(did:test:456), I'm alice(did:test:123), the current latest block hash on ethereum is: 0xc48170964c77065753db2ea5f499964fb4668f0a4a6e4362dceb08553713eaa3, and its December 17th, 2018. We just me at Eve's party, and I want to trust you, can you sign this message and return it to me?"

Bob uses a key listed in his DID Document, signs the message and returns it to Alice, it looks like this:

```
{
  "subject": "did:test:456",
  "claims": {
    "message": "<Alice's Message>"
  },
  "proofChain": [
    {
      "type": "LinkedDataSignature2015",
      "created": "2018-12-10T21:09:23.460Z",
      "creator": "did:test:456#kid=69dec37005c2df5414e356d8269ff79cdca772e7f57438ea35d35850c82f3e1e",
      "signatureValue": "-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.0.1\r\nComment: https://openpgpjs.org\r\n\r\nwl4EARMIABAFAlwO1gMJENi3OZuVX2/+AACtHAD/QhwMDBizReiKjZ11++ol\nYjBPnUCQKnxUr3poKNffDU8BAMZVYiM99wjKYmCiOyFyK6bVzGjSmHTjfEFL\ncUqZculT\r\n=8QTh\r\n-----END PGP SIGNATURE-----\r\n",
      "nonce": "a706ad93f2a18d032243b2e672db518a",
      "domain": "wallet",
      "meta": {
        "version": "openpgp@^4.0.1",
        "kid": "did:test:456#kid=69dec37005c2df5414e356d8269ff79cdca772e7f57438ea35d35850c82f3e1e"
      }
    }
  ]
}

```

Alice resolve's Bob's DID, verifies that his response to her message was signed with the key listed in his DID Document, and she now trusts that at least Bob can sign messages with that key.

If Alice were an http server, she might issue Bob a short lived JWT so he does not need to sign every operation he needs to make... She might also require that he does both.

Alice might be paranoid and not trust that Bob can protect his private key, or that he likes to read her plaintext messages while live streaming on twitch. 

But at the very least, Alice has challenged a person claiming to control a DID, and that person has passed the challenge proving that they are in control of private keys listed in the DID Document.