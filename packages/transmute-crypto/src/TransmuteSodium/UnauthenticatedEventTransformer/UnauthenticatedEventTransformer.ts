const _sodium = require('libsodium-wrappers')

import { getSodium, IFSA, IEncryptedFSA } from '../../transmute-crypto'

import { hexToAscii } from '../utils'

export class UnauthenticatedEventTransformer {
  constructor(private publicKey: Uint8Array, private privateKey?: Uint8Array) {}

  encryptEvents = async (events: IFSA[]) => {
    const sodium = await getSodium()
    return events.map(event => {
      let payloadString = JSON.stringify(event.payload)
      let sealedBox = sodium.crypto_box_seal(payloadString, this.publicKey)
      return {
        ...event,
        payload: {
          cryptoBox: '0x' + sodium.to_hex(sealedBox)
        }
      }
    })
  }

  decryptEvents = async (events: IFSA[]) => {
    const sodium = await getSodium()
    return events.map(event => {
      let box = sodium.from_hex(event.payload.cryptoBox.replace('0x', ''))
      let unsealedBox = sodium.crypto_box_seal_open(box, this.publicKey, this.privateKey)
      let payloadString = hexToAscii('0x' + sodium.to_hex(unsealedBox))
      return {
        ...event,
        payload: JSON.parse(payloadString)
      }
    })
  }
}
