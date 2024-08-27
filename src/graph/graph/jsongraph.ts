/* eslint-disable @typescript-eslint/no-unused-vars */
// https://github.com/jsongraph/json-graph-specification

import * as jose from 'jose'
import { QuadValue, JsonGraph, JsonGraphNode } from '../../types'
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

export type DecodedJwt = {
  header: Record<string, any>,
  payload: Record<string, any>,
  signature: string
}

const decodeToken = (token: Uint8Array) => {
  const [header, payload, signature] = new TextDecoder().decode(token).split('.')
  return {
    header: JSON.parse(new TextDecoder().decode(jose.base64url.decode(header))),
    payload: JSON.parse(new TextDecoder().decode(jose.base64url.decode(payload))),
    signature
  } as DecodedJwt
}

const addLabel = (node: JsonGraphNode, label: string | string[]) => {
  if (node === undefined || label === null || label === undefined) {
    return
  }
  if (Array.isArray(label)) {
    for (const lab of label) {
      addLabel(node, lab)
    }
  } else {
    if (node.labels && !node.labels.includes(label)) {
      node.labels.push(label)
    }
  }
}

const addEnvelopedCredentialToGraph = async (graph: JsonGraph, id: string, object: Record<string, any>, signer: any) => {
  const nextId = jose.base64url.encode(await signer.sign(new TextEncoder().encode(object.id)))
  const [prefix, token] = object.id.split(';')
  const contentType = prefix.replace('data:', '')
  addLabel(graph.nodes[object.id], contentType)
  const { header, payload } = decodeToken(new TextEncoder().encode(token))
  const claimsetId = payload.id || `${nextId}:claims`
  addGraphNode({ graph, id: claimsetId })

  await addObjectToGraph(graph, object.id, header, signer)
  await addObjectToGraph(graph, claimsetId, payload, signer)
  addGraphEdge({ graph, source: object.id, label: 'claims', target: claimsetId })

  return graph
}

const addArrayToGraph = async (graph: JsonGraph, id: string, array: any[], signer: any, label = 'includes') => {
  for (const index in array) {
    const item = array[index]
    if (Array.isArray(item)) {
      const nextId = `${id}:${index}`
      addGraphNode({ graph, id: nextId })
      addGraphEdge({ graph, source: id, label, target: nextId })
      await addArrayToGraph(graph, nextId, item, signer)
    } else if (typeof item === 'object') {
      const nextId = item.id || `${id}:${index}`
      addGraphNode({ graph, id: nextId })
      addGraphEdge({ graph, source: id, label, target: nextId })
      await addObjectToGraph(graph, nextId, item, signer)
    } else {
      if (label !== '@context') {
        addLabel(graph.nodes[id], item)
      }
    }
  }
}

const addObjectToGraph = async (graph: JsonGraph, id: string, object: Record<string, any>, signer: any) => {
  for (const [key, value] of Object.entries(object)) {
    if (['id', 'kid'].includes(key)) {
      if (value.startsWith("data:")) {
        await addEnvelopedCredentialToGraph(graph, id, object, signer)
      } else {
        addGraphNode({ graph, id: value })
        if (id !== value) {
          addGraphEdge({ graph, source: id, label: key, target: value })
        }
      }
    } else if (['holder', 'issuer',].includes(key)) {
      if (typeof value === 'object') {
        const nextId = value.id || `${id}:${key}`
        addGraphNode({ graph, id: nextId })
        addGraphEdge({ graph, source: id, label: key, target: nextId })
        await addObjectToGraph(graph, nextId, value, signer)
      } else {
        addGraphNode({ graph, id: value })
        addGraphEdge({ graph, source: value, label: key, target: id })
      }
    } else if (['type'].includes(key)) {
      addLabel(graph.nodes[id], value)
    } else if (Array.isArray(value)) {
      await addArrayToGraph(graph, id, value, signer, key)
    } else if (typeof value === 'object') {
      // handle objects
      const nextId = value.id || `${id}:${key}`
      addGraphNode({ graph, id: nextId })
      addGraphEdge({ graph, source: id, label: key, target: nextId })
      await addObjectToGraph(graph, nextId, value, signer)
    } else {
      // simple types
      addGraphNodeProperty(
        graph,
        id,
        key,
        value
      )
    }
  }
}

const fromJwt = async (token: Uint8Array, type: string) => {
  const { header, payload } = decodeToken(token)
  const root = `data:${type};${new TextDecoder().decode(token)}`
  const signer = await hmac.signer(new TextEncoder().encode(root))
  const graph = {
    nodes: {},
    edges: []
  }
  addGraphNode({ graph, id: root })
  addLabel(graph.nodes[root], type)
  const nextId = jose.base64url.encode(await signer.sign(new TextEncoder().encode(root)))
  const claimsetId = payload.id || `${nextId}:claims`
  addGraphNode({ graph, id: claimsetId })
  await addObjectToGraph(graph, root, header, signer)
  addGraphEdge({ graph, source: root, label: 'claims', target: claimsetId })
  await addObjectToGraph(graph, claimsetId, payload, signer)
  return graph
}


const graph = async (document: Uint8Array, type: string) => {
  const tokenToClaimset = (token: Uint8Array) => {
    const [_header, payload, _signature] = new TextDecoder().decode(token).split('.')
    return JSON.parse(new TextDecoder().decode(jose.base64url.decode(payload)))
  }
  switch (type) {
    case 'application/vc': {
      return annotate(await fromCredential(JSON.parse(new TextDecoder().decode(document))))
    }
    case 'application/vp': {
      return annotate(await fromPresentation(document))
    }
    case 'application/vc-ld+jwt':
    case 'application/vc-ld+sd-jwt': {
      return annotate(await fromCredential(tokenToClaimset(document)))
    }
    case 'application/vp-ld+jwt':
    case 'application/vp-ld+sd-jwt': {
      return annotate(await fromPresentation(tokenToClaimset(document)))
    }
    case 'application/vc+jwt':
    case 'application/vp+jwt':
    case 'application/jwt': {
      return await fromJwt(document, type)
    }
    default: {
      throw new Error('Cannot compute graph from unsupported content type: ' + type)
    }
  }
}

export const jsongraph = {
  graph,
  fromNQuads,
  fromCredential,
  fromPresentation
}

