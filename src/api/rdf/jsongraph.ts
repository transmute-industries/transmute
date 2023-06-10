// https://github.com/jsongraph/json-graph-specification
import * as jose from 'jose'
import { DataIntegrityDocument, QuadValue, JsonGraph } from './types'
import canonize from '../../api/rdf/canonize'
import hmac from '../../api/jose/hmac'
import documentLoader from '../../api/rdf/documentLoader'

import { isVC, isVP } from './utils'
import annotateGraph from './annotateGraph'
const addGraphNode = ({ graph, id }) => {
  graph.nodes[id] = {
    ...(graph.nodes[id] || { id, labels: ['Node'] }),
  }
}
const addGraphNodeProperty = (graph, id, key, value) => {
  graph.nodes[id] = {
    ...graph.nodes[id],
    [key]: value,
  }
}
const addGraphEdge = ({ graph, source, label, target }) => {
  graph.edges.push(
    JSON.parse(
      JSON.stringify({
        source,
        label,
        target,
      }),
    ),
  )
}
const updateGraph = (graph, nquad) => {
  addGraphNode({ graph, id: nquad.subject.value })
  if (!nquad.object.datatype) {
    addGraphNode({ graph, id: nquad.object.value })
    addGraphEdge({
      graph,
      source: nquad.subject.value,
      label: nquad.predicate.value,
      target: nquad.object.value,
    })
  } else {
    addGraphNodeProperty(
      graph,
      nquad.subject.value,
      nquad.predicate.value,
      nquad.object.value,
    )
  }
}

const fromNQuads = (quads: QuadValue[]) => {
  const graph = { nodes: {}, edges: [] }
  quads.forEach((nquad) => {
    updateGraph(graph, nquad)
  })
  return graph
}

const fromJsonLd = async ({
  document,
  signer,
}: {
  document: DataIntegrityDocument
  signer: { sign: (bytes: Uint8Array) => Promise<Uint8Array> }
}): Promise<JsonGraph> => {
  const nquads = await canonize({
    signer,
    document,
    documentLoader,
  })
  return fromNQuads(nquads)
}

const fromCredential = async (document: DataIntegrityDocument) => {
  const { proof, ...credential } = document
  const key = hmac.key()
  const signer = await hmac.signer(key)
  const graph = await fromJsonLd({ document: credential, signer })
  if (proof !== undefined) {
    const proofs = Array.isArray(proof) ? proof : [proof]
    await Promise.all(
      proofs.map(async (proof) => {
        const key = hmac.key()
        const signer = await hmac.signer(key)
        const proofGraph = await fromJsonLd({
          document: { '@context': credential['@context'], ...proof },
          signer,
        })
        const credentialId = Object.keys(graph.nodes)[0]
        const proofId = Object.keys(proofGraph.nodes)[0]
        graph.nodes = { ...graph.nodes, ...proofGraph.nodes }
        graph.edges = [
          ...graph.edges,
          {
            source: proofId,
            label: 'https://w3id.org/security#proof',
            target: credentialId,
          },
          ...proofGraph.edges,
        ]
      }),
    )
  }
  return graph
}

const fromPresentation = async (document: DataIntegrityDocument) => {
  const { proof, verifiableCredential, ...presentation } = document
  const key = hmac.key()
  const signer = await hmac.signer(key)
  const graph = await fromJsonLd({ document: presentation, signer })
  if (verifiableCredential !== undefined) {
    const verifiableCredentials = Array.isArray(verifiableCredential)
      ? verifiableCredential
      : [verifiableCredential]
    await Promise.all(
      verifiableCredentials.map(async (verifiableCredential) => {
        const credentialGraph = await fromCredential(verifiableCredential)
        const presentationId = Object.keys(graph.nodes)[0]
        const credentialId = Object.keys(credentialGraph.nodes)[0]
        graph.nodes = { ...graph.nodes, ...credentialGraph.nodes }
        graph.edges = [
          ...graph.edges,
          {
            source: presentationId,
            label: 'https://www.w3.org/2018/credentials#verifiableCredential',
            target: credentialId,
          },
          ...credentialGraph.edges,
        ]
      }),
    )
  }
  if (proof !== undefined) {
    const proofs = Array.isArray(proof) ? proof : [proof]
    await Promise.all(
      proofs.map(async (proof) => {
        const key = hmac.key()
        const signer = await hmac.signer(key)
        const proofGraph = await fromJsonLd({
          document: { '@context': document['@context'], ...proof },
          signer,
        })
        const presentationId = Object.keys(graph.nodes)[0]
        const proofId = Object.keys(proofGraph.nodes)[0]
        graph.nodes = { ...graph.nodes, ...proofGraph.nodes }
        graph.edges = [
          ...graph.edges,
          {
            source: proofId,
            label: 'https://w3id.org/security#proof',
            target: presentationId,
          },
          ...proofGraph.edges,
        ]
      }),
    )
  }
  return graph
}

const fromJwt = async (jwt: string) => {
  const header = jose.decodeProtectedHeader(jwt)
  const claimset = jose.decodeJwt(jwt)
  const key = hmac.key()
  const signer = await hmac.signer(key)
  const headerGraph = await fromJsonLd({
    document: {
      '@context': { '@vocab': 'https://www.iana.org/assignments/jose#' },
      ...header,
    },
    signer,
  })
  const claimsetGraph = await fromDocument(claimset)
  const headerId = Object.keys(headerGraph.nodes)[0]
  const claimsetId = Object.keys(claimsetGraph.nodes)[0]
  claimsetGraph.nodes = { ...claimsetGraph.nodes, ...headerGraph.nodes }
  claimsetGraph.edges = [
    ...claimsetGraph.edges,
    {
      source: headerId,
      label: 'https://datatracker.ietf.org/doc/html/rfc7515#section-4',
      target: claimsetId,
    },
    ...headerGraph.edges,
  ]
  return claimsetGraph
}

const fromDocument = async (document: DataIntegrityDocument) => {
  let graph
  if (document.jwt) {
    graph = await fromJwt(document.jwt)
  } else if (isVC(document)) {
    graph = await fromCredential(document)
  } else if (isVP(document)) {
    graph = await fromPresentation(document)
  } else {
    const key = hmac.key()
    const signer = await hmac.signer(key)
    graph = await fromJsonLd({ document, signer })
  }
  const withAnnotation = annotateGraph(graph)
  return withAnnotation
}

const api = {
  fromNQuads,
  fromDocument,
  fromCredential,
}

export default api
