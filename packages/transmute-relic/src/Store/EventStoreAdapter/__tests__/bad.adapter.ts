const bs58 = require('bs58')
import { EventStoreAdapter } from '../index'

/**
 * Bad adapter tests
 */
describe('Bad adapter tests', () => {
  it('throws errors when passed TransmuteNativeEncondingType ', async () => {
    try {
      let storeTypeAdapter = new EventStoreAdapter({
        S: undefined as any
      })
    } catch (e) {
      expect(e.message).toBe('Mapper keys cannot container reserved encoding types: S,A,B,U')
    }
  })

  it('throws when converter does not cover all adapter keys ', async () => {
    try {
      let storeTypeAdapter = new EventStoreAdapter({
        P: undefined as any
      })
    } catch (e) {
      expect(e.message).toBe('Mapper : P does not implement IAdapterMapper')
    }
  })
})
