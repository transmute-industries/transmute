export interface IFSA {
  type: string
  payload: any
  meta: any
}

export interface IEncryptedFSA {
  type: string
  payload: {
    header?: string
    cipherText: string
  }
  meta: any
}
