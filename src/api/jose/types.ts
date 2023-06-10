import * as jose from 'jose'

import { DataIntegrityDocument, DocumentLoader } from '../rdf/types'

export type HMAC_ALG = 'HS256' | 'HS384' | 'HS512'
export type Jwk = { kty: string } & Record<string, string | object>
export type RestrictedJwk = { alg: string } & Record<string, string | object>
export type RestrictedPublicKeyJwk = RestrictedJwk
export type RestrictedPrivateKeyJwk = RestrictedPublicKeyJwk & { d: string }

export type RestrictedDisclosureJwk = RestrictedPublicKeyJwk & {
  claimset_formats_supported: string[]
  claimset_claims_supported: string[]
}

export type DigestKey = Jwk & { k: string }
export type RestrictedHmacJwk = RestrictedJwk & { k: string }
export type RestrictedDisclosureKeys = [
  RestrictedDisclosureJwk,
  RestrictedHmacJwk,
  DigestKey,
  DigestKey,
]

export type DataIntegrityProof = {
  '@context'?: string | object
  type: 'DataIntegrityProof'
  proofPurpose: 'assertionMethod' | string
  verificationMethod: string
  created: string
}

export type DiSdJoseProof = DataIntegrityProof & {
  cryptosuite: 'di-sd-sha256-jose-EdDSA-2023' | string
  keys?: RestrictedDisclosureKeys
  signature?: string
  signatures?: string[]
}

export type DiSdJoseDisclosureProof = DiSdJoseProof & {
  labels?: object
  mandatoryIndexes?: string[]
}

export type FlattendedDetachedJws = {
  protected: string
  payload: Uint8Array
  signature: string
}

export type VerifyFlattenedDetachedJws = (
  jws: FlattendedDetachedJws,
) => Promise<{
  protectedHeader: jose.JWSHeaderParameters
  payload: Uint8Array
}>

export type FlattenedDetachedJwsVerifier = {
  alg: string
  verify: VerifyFlattenedDetachedJws
}

export type RequestPresentation = {
  document: DataIntegrityDocument
  verifier: FlattenedDetachedJwsVerifier
  selectivePointers: string[]
  canonicalization: string
  documentLoader: DocumentLoader
}

export type RequestVerification = {
  document: DataIntegrityDocument
  verifier: FlattenedDetachedJwsVerifier
  canonicalization: string
  documentLoader: DocumentLoader
}
