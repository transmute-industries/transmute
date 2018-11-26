
## DID Recovery

Let us consider the case of a DID created from a wallet using the `transmute-did` library. The wallet ciphertext is symmetric encryption. The key is from a lib sodium key derrivation function of a public salt an a password.

For low value identities this is sufficient, however, an additional level of encryption can be applied, allowing for more public storage of ciphertext.

We can use shamir secret sharing to generate a symmetric key, and use this key instead of the key from the salt and password to encrypt the plaintext wallet.

We must then split the key shares up (store them on seperate systems, ideally physical lcoations), so that only after recovering n of m shares can the plaintext private key for the DID Document be recovered.

Plaintext wallet data should never be written to disk, so when recovering from shamir secret shares, a new password will be required to generate a ciphertext wallet.

Lets assume the user makes use of both private key recovery methods, and has a shamir encrypted long term wallet, and a password encrypted short term wallet.

Both wallets can create the DID Document for a given private key, so both wallets will allow for a revocation of the DID Document.

### Continuity of Identity

Trust is destroyed when a private key is compromised. 

It is important that a recovation for the DID be issued as soon as a key is compromised.

It is possible to construct a chain of recovery keys, such that the following properties hold:

1. User reputation is constructed from signed events up the moment of a revocation.
1. User can retain reputation from old keys by linking them to new ones by revealing a recovery signature (a message saying which new public key is to be trusted after revocation).

Not all cryptographic systems will respect this operation. 

The default case will be that there is no continuity of identity, and a revocation will end the reputation of a given identity.
