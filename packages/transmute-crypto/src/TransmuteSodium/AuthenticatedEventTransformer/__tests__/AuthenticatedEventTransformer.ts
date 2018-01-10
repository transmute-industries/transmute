import {
  AuthenticatedEventTransformer,
  generateSecretKey,
  getSodium
} from '../../../transmute-crypto'

import { plainTextEventStream0, plainTextEventStream1 } from '../../__mocks__/events'

/**
 * AuthenticatedEventTransformer
 */
describe('AuthenticatedEventTransformer', () => {
  it('can securely send messages from one pub/priv key pair to another.', async () => {
    const sodium = await getSodium()
    let alice = sodium.crypto_box_keypair()
    let bob = sodium.crypto_box_keypair()

    let pket = new AuthenticatedEventTransformer(
      alice.publicKey,
      alice.privateKey,
      bob.publicKey,
      bob.privateKey
    )

    let encryptedEvents = await pket.encryptEvents(plainTextEventStream0)
    let decryptedEvents = await pket.decryptEvents(encryptedEvents)
    expect(decryptedEvents).toEqual(plainTextEventStream0)
  })
})
