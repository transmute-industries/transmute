import { getSodium, getWalletFromPrivateKey } from '../../transmute-crypto'
/**
 * Helpers tests
 */
describe('Helpers tests', () => {
  it('getWalletFromPrivateKey', async () => {
    let sodium = await getSodium()
    let alice = sodium.crypto_box_keypair()
    let privateKeyHexString = sodium.to_hex(alice.privateKey)
    // console.log("test", privateKeyHexString);
    let wallet = getWalletFromPrivateKey(privateKeyHexString)
    // console.log(wallet)
    expect(wallet).toBeDefined()
  })
})
