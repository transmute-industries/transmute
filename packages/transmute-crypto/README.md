# Transmute Crypto

Based on:

```
const _sodium = require('libsodium-wrappers');
(async() => {
  await _sodium.ready;
  const sodium = _sodium;
 
  // generate key
  let key = sodium.crypto_secretstream_xchacha20poly1305_keygen();
 
  // prepare to encrypt
  let res = sodium.crypto_secretstream_xchacha20poly1305_init_push(key);
  let [state_out, header] = [res.state, res.header];

  // encrypt
  let c1 = sodium.crypto_secretstream_xchacha20poly1305_push(state_out,
    sodium.from_string('message 1'), null,
    sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE);
    
  let c2 = sodium.crypto_secretstream_xchacha20poly1305_push(state_out,
    sodium.from_string('message 2'), null,
    sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL);
 
  // prepare to decrypt
  let state_in = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, key);

  // decrypt
  let r1 = sodium.crypto_secretstream_xchacha20poly1305_pull(state_in, c1);
  let [m1, tag1] = [sodium.to_string(r1.message), r1.tag];

  let r2 = sodium.crypto_secretstream_xchacha20poly1305_pull(state_in, c2);
  let [m2, tag2] = [sodium.to_string(r2.message), r2.tag];
 
  console.log(m1);
  console.log(m2);

})();
```


// use sodium key pairs to generate web3 accounts + sign and recover.
// console.log(sodium.to_hex(privateKey))
// const account: any = web3.eth.accounts.privateKeyToAccount(sodium.to_hex(privateKey));
// // console.log(account);
// let signatureObject = await web3.eth.accounts.sign('Some data', sodium.to_hex(privateKey));
// let recovered = web3.eth.accounts.recover(signatureObject);
// expect(account.address).toEqual(recovered)

// encrypt / decrypt the private key used by web3...
// let encryptedPK = web3.eth.accounts.encrypt(sodium.to_hex(privateKey), 'yolo');
// let decryptedPk = web3.eth.accounts.decrypt(encryptedPK, 'yolo');

// // https://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html#encrypt

// send authenticated message from alice to bob
// const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
// let box = sodium.crypto_box_easy('hi', nonce, bob.publicKey, alice.privateKey )
// // let data = '0x' + sodium.to_hex(box)
// let decrypted = sodium.crypto_box_open_easy(box, nonce, alice.publicKey, bob.privateKey)
// // console.log( web3.utils.toAscii('0x' + sodium.to_hex(decrypted) ))

// anonymously send a message to bob.
// let sealedBox = sodium.crypto_box_seal('hi', bob.publicKey)
// console.log(sodium.to_hex(sealedBox))

// let unsealedBox = sodium.crypto_box_seal_open(sealedBox, bob.publicKey, bob.privateKey)
// console.log( web3.utils.toAscii('0x' + sodium.to_hex(unsealedBox) ))

// storing password hashes safely
// let safePWHash = sodium.crypto_pwhash_str('boss', 3, 32768)
// console.log(safePWHash)
// let data = sodium.crypto_pwhash_str_verify(safePWHash, 'boss')
// let data2 = sodium.crypto_pwhash_str_verify(safePWHash, 'boss2')
// console.log(data, data2)

// key derivation for secret boxes...

// let masterKey = sodium.crypto_kdf_keygen()
// console.log(sodium.to_hex(masterKey))
// Examples of contexts include UserName, __auth__, pictures and userdata.
// const derived1 = sodium.crypto_kdf_derive_from_key(sodium.crypto_secretbox_KEYBYTES, 1234, "userdata", masterKey);
// console.log(derived1)

// https://download.libsodium.org/doc/advanced/scalar_multiplication.html

// not sure why we would need ECDH over Curve25519 ... but we can haz it..

- https://gist.github.com/jo/8619441
