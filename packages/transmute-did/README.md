# Transmute DID

A library for working with decentralized identities across multiple crypto systems.

WIP / Unsafe to use.


```
npm i
npm run test
```

# What it does

The `transmute-id` package contains several libraries for basic cryptographic operations

## `src/lib/eth/`: Ethereum

Creating an Ethereum identity
- Generate a BIP-39 Mnemonic
- Get a keypair from a mnemonic and a derivation path
- Get an Ethereum address from a public key

## `src/lib/pgp/`: PGP

PGP uses RSA by default but also supports the following Elliptic Curves: `curve25519, p256, p384, p521, secp256k1, brainpoolP256r1, brainpoolP384r1, brainpoolP512r1`.

This library provides:
- generation of PGP keypairs from a name and a passphrase
- Signing a message with the sender's private key
- Verifying a message with the sender's public key
- Encrypting a message with the recipient's public key and signing it with the sender's private key
- Decrypting a message with the recipient's private key and verifying it with the sender's public key

## `src/lib/msg/`: Libsodium

LibSodium uses `ED25519` by default.

This library provides:
- a Signature scheme using libsodium's [crypto_sign](https://nacl.cr.yp.to/sign.html)
- a Public-key authenticated encryption scheme using libsodium's [crypto_box](https://nacl.cr.yp.to/box.html)

## `src/lib/misc/`: Miscellaneous tools

This library provides
- Shamir secret sharing methods
- Transmute DID document generation
- converting keypairs to a ciphertext wallet
