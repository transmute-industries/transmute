/* eslint-disable @typescript-eslint/no-unused-vars */
// https://github.com/jsongraph/json-graph-specification

import * as jose from 'jose'
import { QuadValue, JsonGraph } from '../../types'
import { documentLoader, defaultContext } from './documentLoader'
import { annotate } from './annotate'
import { canonize } from './canonize'
import { hmac } from './hmac'

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
  document: any
  signer: { sign: (bytes: Uint8Array) => Promise<Uint8Array> }
}): Promise<JsonGraph> => {
  const nquads = await canonize({
    signer,
    document,
    documentLoader,
  })
  return fromNQuads(nquads)
}

const fromCredential = async (document: any) => {
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

const fromPresentation = async (document: any) => {
  const { proof, verifiableCredential, ...presentation } = document
  const key = hmac.key()
  const signer = await hmac.signer(key)
  const graph = await fromJsonLd({ document: presentation, signer })
  if (verifiableCredential !== undefined) {
    const verifiableCredentials = Array.isArray(verifiableCredential)
      ? verifiableCredential
      : [verifiableCredential]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const presentationGraphEdge: any = graph.edges.find((e) => {
      return e.target === 'https://www.w3.org/2018/credentials#VerifiablePresentation'
    })
    await Promise.all(
      verifiableCredentials.map(async (verifiableCredential) => {
        const normalizeToTypeArray = Array.isArray(verifiableCredential.type) ? verifiableCredential.type : [verifiableCredential.type]
        let credentialGraph = undefined as any;
        if (normalizeToTypeArray.includes('EnvelopedVerifiableCredential')) {
          if (verifiableCredential.id && verifiableCredential.id.includes('+sd-jwt;')) {
            const token = verifiableCredential.id.split('+sd-jwt;').pop()
            const payload = jose.decodeJwt(token)
            credentialGraph = await fromCredential(payload)
          }
          if (verifiableCredential.id && verifiableCredential.id.includes('+jwt;')) {
            const token = verifiableCredential.id.split('+jwt;').pop()
            const payload = jose.decodeJwt(token)
            credentialGraph = await fromCredential(payload)
          }
        } else {
          credentialGraph = await fromCredential(verifiableCredential)
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const credentialGraphEdge: any = credentialGraph.edges.find((e) => {
          return e.target === 'https://www.w3.org/2018/credentials#VerifiableCredential'
        })
        const presentationId = presentationGraphEdge.source
        const credentialId = credentialGraphEdge.source;
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

const graph = async (document: Uint8Array, type: string) => {
  let graph
  const tokenToClaimset = (token: Uint8Array) => {
    const [_header, payload, _signature] = new TextDecoder().decode(token).split('.')
    return JSON.parse(new TextDecoder().decode(jose.base64url.decode(payload)))
  }
  switch (type) {
    case 'application/vc': {
      graph = await fromCredential(JSON.parse(new TextDecoder().decode(document)))
      break
    }
    case 'application/vp': {
      graph = await fromPresentation(document)
      break
    }
    case 'application/vc-ld+jwt':
    case 'application/vc-ld+sd-jwt': {
      graph = await fromCredential(tokenToClaimset(document))
      break
    }
    case 'application/vp-ld+jwt':
    case 'application/vp-ld+sd-jwt': {
      graph = await fromPresentation(tokenToClaimset(document))
      break
    }
    default: {
      throw new Error('Cannot compute graph from unsupported content type: ' + type)
    }
  }
  return annotate(graph)
}

export const jsongraph = {
  graph,
  fromNQuads,
  fromCredential,
  fromPresentation
}

