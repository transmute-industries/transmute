const _sodium = require('libsodium-wrappers')

import { getSodium, IFSA, IEncryptedFSA } from '../../transmute-crypto'

import { hexToAscii } from '../utils'

export class AuthenticatedEventTransformer {
  constructor(
    private senderPublicKey?: Uint8Array,
    private senderPrivateKey?: Uint8Array,
    private recipientPublicKey?: Uint8Array,
    private recipientPrivateKey?: Uint8Array
  ) {}

  encryptEvents = async (events: IFSA[]) => {
    const sodium = await getSodium()
    return events.map(event => {
      const payloadString = JSON.stringify(event.payload)
      const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES)
      const box = sodium.crypto_box_easy(
        payloadString,
        nonce,
        this.recipientPublicKey,
        this.senderPrivateKey
      )
      const boxedData = sodium.to_hex(box)
      return {
        ...event,
        payload: {
          nonce: '0x' + sodium.to_hex(nonce),
          cryptoBox: '0x' + boxedData
        }
      }
    })
  }

  decryptEvents = async (events: IFSA[]) => {
    const sodium = await getSodium()

    return events.map(event => {
      const box = sodium.from_hex(event.payload.cryptoBox.replace('0x', ''))
      const nonce = sodium.from_hex(event.payload.nonce.replace('0x', ''))
      const decrypted = sodium.crypto_box_open_easy(
        box,
        nonce,
        this.senderPublicKey,
        this.recipientPrivateKey
      )
      let data = hexToAscii('0x' + sodium.to_hex(decrypted))
      return {
        ...event,
        payload: JSON.parse(data)
      }
    })
  }
}
