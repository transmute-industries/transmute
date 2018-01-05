const _sodium = require('libsodium-wrappers')

import { getSodium, IFSA, IEncryptedFSA } from '../../transmute-crypto'

export class SecretKeyEventTransformer {
  private secretKey: Uint8Array
  private header: Uint8Array | undefined

  constructor(secretKey: Uint8Array, header?: Uint8Array) {
    this.secretKey = secretKey
    this.header = header
  }

  encryptEvents = async (events: IFSA[]): Promise<IEncryptedFSA[]> => {
    const sodium = await getSodium()

    let res = sodium.crypto_secretstream_xchacha20poly1305_init_push(this.secretKey)
    let [stateOut, header] = [res.state, res.header]

    let encryptedEvents = await Promise.all(
      events.map(async (event, i) => {
        let plainTextEventString = JSON.stringify(event.payload)
        let tag =
          i === events.length - 1
            ? sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE
            : sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL

        let cipherText = sodium.crypto_secretstream_xchacha20poly1305_push(
          stateOut,
          sodium.from_string(plainTextEventString),
          null,
          tag
        )
        let encryptedEvent: IEncryptedFSA = {
          ...event,
          payload: {
            cipherText: sodium.to_hex(cipherText)
          }
        }

        if (i === 0) {
          encryptedEvent.payload.header = sodium.to_hex(header)
        }

        return encryptedEvent
      })
    )
    return encryptedEvents
  }

  decryptEvents = async (events: IFSA[]) => {
    const sodium = await getSodium()

    // this.header must be defined in order to decrypt an event stream.
    if (this.header === undefined) {
      if (events[0].payload.header === undefined) {
        throw new Error('expect first event to have header, or for header to be defined already.')
      }
      this.header = sodium.from_hex(events[0].payload.header)
    }

    // prepare to decrypt
    let stateIn = sodium.crypto_secretstream_xchacha20poly1305_init_pull(
      this.header,
      this.secretKey
    )

    let recoveredEvents = await Promise.all(
      events.map(event => {
        if (event.payload.header !== undefined) {
          this.header = sodium.from_hex(event.payload.header)
          stateIn = sodium.crypto_secretstream_xchacha20poly1305_init_pull(
            this.header,
            this.secretKey
          )
        }
        let pull = sodium.crypto_secretstream_xchacha20poly1305_pull(
          stateIn,
          sodium.from_hex(event.payload.cipherText)
        )
        let [message, tag] = [sodium.to_string(pull.message), pull.tag]
        return {
          ...event,
          payload: JSON.parse(message)
        }
      })
    )

    return recoveredEvents
  }
}
