import jsonld from 'jsonld'
import { NQuads } from 'rdf-canonize'

import { remoteBlankNodeSigner } from './remoteBlankNodeSigner'

import {
  RequestSignedBlankNodeComponents,
  Quad,
  QuadValue,
  RequestHmacCanonize,
} from '../../types'

const COMPONENT_NAMES = ['subject', 'predicate', 'object', 'graph']

const signBlankNodeComponents = async ({
  quad,
  signer,
}: RequestSignedBlankNodeComponents) => {
  const clone = JSON.parse(JSON.stringify(quad))
  for (const name of COMPONENT_NAMES) {
    if (quad[name].termType === 'BlankNode') {
      clone[name].value = await signer.sign(quad[name].value)
    }
  }
  return clone
}

export const canonize = async ({
  signer,
  labels,
  document,
  documentLoader,
}: RequestHmacCanonize): Promise<QuadValue[]> => {
  if (!(document && typeof document === 'object')) {
    throw new TypeError('"document" must be an object.')
  }
  const original = await jsonld.canonize(document, {
    algorithm: 'URDNA2015',
    format: 'application/n-quads',
    documentLoader,
    safe: false // required to support google knowledge graph
  })
  const sorted = original.split('\n').sort().join('\n')
  const remoteSigner = await remoteBlankNodeSigner({ labels, signer })
  const signedQuads = await Promise.all(
    NQuads.parse(sorted).map((quad: Quad) =>
      signBlankNodeComponents({ quad, signer: remoteSigner }),
    ),
  )
  return signedQuads.sort()
}

