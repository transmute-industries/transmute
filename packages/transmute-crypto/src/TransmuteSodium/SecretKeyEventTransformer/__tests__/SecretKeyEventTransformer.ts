import { SecretKeyEventTransformer, generateSecretKey, getSodium } from '../../../transmute-crypto'

import { plainTextEventStream0, plainTextEventStream1 } from '../../__mocks__/events'

/**
 * SecretKeyEventTransformer
 */
describe('SecretKeyEventTransformer', () => {
  it('can handle streams with different headers', async () => {
    const sodium = await getSodium()
    let secretKey = await generateSecretKey()

    let esem = new SecretKeyEventTransformer(secretKey)

    // each call will generate a new header and save it in the first event.payload.header
    let result1 = await esem.encryptEvents(plainTextEventStream0)
    let result2 = await esem.encryptEvents(plainTextEventStream1)

    let allEncryptedEvents = [...result1.encryptedEvents, ...result2.encryptedEvents]
    let allPlainTextEvents = [...plainTextEventStream0, ...plainTextEventStream1]

    // console.log(JSON.stringify(allEncryptedEvents, null, 2));
    let { decryptEvents } = await esem.decryptEvents(allEncryptedEvents)
    //  console.log(JSON.stringify(decryptEvents, null, 2));
    expect(decryptEvents).toEqual(allPlainTextEvents)
  })
})
