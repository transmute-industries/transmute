import { PublicKeyEventTransformer, generateSecretKey, getSodium } from '../../../transmute-crypto'

import { plainTextEventStream0, plainTextEventStream1 } from '../../__mocks__/events'
import Web3 from 'web3'

const web3: any = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
/**
 * PublicKeyEventTransformer
 */
describe('PublicKeyEventTransformer', () => {
  it('can handle streams with different headers', async () => {
    const sodium = await getSodium()

    // let { publicKey, privateKey } = sodium.crypto_box_keypair();
    let alice = sodium.crypto_box_keypair()
    let bob = sodium.crypto_box_keypair()

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
  })
})
