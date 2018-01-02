const _sodium = require('libsodium-wrappers')

import { getSodium, IFSA, IEncryptedFSA } from '../../transmute-crypto'

export class PublicKeyEventTransformer {
  public secretKey: Uint8Array
  public header: Uint8Array | undefined

  constructor(secretKey: Uint8Array, header?: Uint8Array) {
    // this.secretKey = secretKey;
    // this.header = header;
  }
}
