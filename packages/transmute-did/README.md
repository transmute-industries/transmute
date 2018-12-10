# Transmute DID

🚧 Under Construction. Not for production use! 🚧

<p align="center">
  <img src="../../transmute-banner.png"/>
</p>

> Decentralized Identifiers (DIDs) are a new type of identifier for verifiable, "self-sovereign" digital identity. DIDs are fully under the control of the DID subject, independent from any centralized registry, identity provider, or certificate authority. DIDs are URLs that relate a DID subject to means for trustable interactions with that subject. DIDs resolve to DID Documents — simple documents that describe how to use that specific DID. Each DID Document contains at least three things: cryptographic material, authentication suites, and service endpoints. Cryptographic material combined with authentication suites provide a set of mechanisms to authenticate as the DID subject (e.g., public keys, pseudonymous biometric protocols, etc.). Service endpoints enable trusted interactions with the DID subject.

#### [W3C DID Spec](https://w3c-ccg.github.io/did-spec/)
#### [W3C VC Data Model](https://www.w3.org/TR/verifiable-claims-data-model/)

### Getting Started

```
npm i
npm run test
```

### Documentation

This library uses self describing json-ld.

#### [Nested DID Spec](./docs/nested-did-spec.md)

## What it does

The `transmute-did` package contains several libraries for basic cryptographic operations

## `src/lib/ethereumExtensions/`: Ethereum

Creating an Ethereum identity

- Generate a BIP-39 Mnemonic
- Get a keypair from a mnemonic and a derivation path
- Get an Ethereum address from a public key

## `src/lib/openpgpExtensions/`: PGP

PGP uses RSA by default but also supports the following Elliptic Curves: `curve25519, p256, p384, p521, secp256k1, brainpoolP256r1, brainpoolP384r1, brainpoolP512r1`.

This library provides:

- generation of PGP keypairs from a name and a passphrase
- Signing a message with the sender's private key
- Verifying a message with the sender's public key
- Encrypting a message with the recipient's public key and signing it with the sender's private key
- Decrypting a message with the recipient's private key and verifying it with the sender's public key

## `src/lib/sodiumExtensions/`: Libsodium

LibSodium uses `ED25519` by default.

This library provides:

- a Signature scheme using libsodium's [crypto_sign](https://nacl.cr.yp.to/sign.html)
- a Public-key authenticated encryption scheme using libsodium's [crypto_box](https://nacl.cr.yp.to/box.html)

## `src/lib/shamirExtensions/`: Secret Sharing

This library provides

- Shamir secret sharing methods

## `src/lib/misc/`: Miscellaneous tools

This library provides

- Transmute DID document generation
- converting keypairs to a ciphertext wallet
