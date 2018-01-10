import {
  UnauthenticatedEventTransformer,
  generateSecretKey,
  getSodium
} from '../../../transmute-crypto'

import { plainTextEventStream0, plainTextEventStream1 } from '../../__mocks__/events'


/**
 * UnauthenticatedEventTransformer
 */
describe('UnauthenticatedEventTransformer', () => {
  it('can securly send anonymous events to a public key', async () => {
    const sodium = await getSodium()
    let alice = sodium.crypto_box_keypair()
    let pket = new UnauthenticatedEventTransformer(alice.publicKey, alice.privateKey)
    let encryptedEvents = await pket.encryptEvents(plainTextEventStream0)
    let decryptedEvents = await pket.decryptEvents(encryptedEvents)
    expect(decryptedEvents).toEqual(plainTextEventStream0)
  })
})
