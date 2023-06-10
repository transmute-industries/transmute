import { DocumentLoader } from './DocumentLoader'

export type RequestHmacCanonize = {
  signer: { sign: (bytes: Uint8Array) => Promise<Uint8Array> }
  labels?: Map<string, string>
  document: object
  documentLoader: DocumentLoader
}