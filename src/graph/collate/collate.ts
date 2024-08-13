import moment from "moment";
import { cbor, Hash, Protected, Signature, Unprotected, VerifiableDataProofTypes, VerifiableDataStructures } from "@transmute/cose";
import { JsonGraph, JsonGraphEdge, JsonGraphNode } from "../../types";

export const collate = async (data: Uint8Array, inputType = 'application/cose', outputType = 'application/vnd.jgf+json'): Promise<JsonGraph> => {

  const decoded = cbor.decode(data)
  if (decoded.tag !== 18) {
    throw new Error('Only cose-sign1 / tag 18 is supported.')
  }

  const header = cbor.decode(decoded.value[0])
  const payload = decoded.value[2].toString('hex')
  let sig = header.get(Protected.Alg)
  let hash = header.get(Protected.PayloadHashAlgorithm)
  const payloadPreImageContentType = header.get(Protected.PayloadPreImageContentType)
  const payloadLocation = header.get(Protected.PayloadLocation)
  const cwtClaims = header.get(Protected.CWTClaims)
  const iat = cwtClaims.get(6)
  const iss = cwtClaims.get(1)
  const sub = cwtClaims.get(2)
  if (hash === Hash.SHA256) {
    hash = 'sha256'
  }
  if (sig === Signature.ES256) {
    sig = 'ES256'
  }
  const nodes = {} as Record<string, JsonGraphNode>;
  const edges = [] as JsonGraphEdge[]
  const uri = `data:${inputType};base64,${Buffer.from(data).toString('base64')}`
  const statement = {
    id: uri,
    name: 'Statement',
    issuer: iss,
    subject: sub,
    issued: moment.unix(iat).toISOString(),
    hash_value: payload,
    hash_algorithm: hash,
    signature_algorithm: sig,
    content_type: payloadPreImageContentType,
    location: payloadLocation,
    labels: ['scitt-statement'],
  };
  nodes[statement.id] = statement;
  (decoded.value[1].get(Unprotected.Receipts) || []).map((r) => {
    const r2 = cbor.decode(r)
    const header = cbor.decode(r2.value[0])
    let alg = header.get(Protected.Alg)
    let vds = header.get(Protected.VerifiableDataStructure)
    let vdp = r2.value[1].get(Unprotected.VerifiableDataProofs).get(VerifiableDataProofTypes["RFC9162-Inclusion-Proof"]) ? 'RFC9162-Inclusion-Proof' : 'RFC9162-Consistency-Proof'
    const cwtClaims = header.get(Protected.CWTClaims)
    const iat = cwtClaims.get(6)
    const iss = cwtClaims.get(1)
    const sub = cwtClaims.get(2)
    if (vds === VerifiableDataStructures["RFC9162-Binary-Merkle-Tree"]) {
      vds = "Binary Merkle Tree"
    }
    if (alg === Signature.ES256) {
      alg = 'ES256'
    }
    const uri = `data:${inputType};base64,${Buffer.from(r).toString('base64')}`
    const receipt = {
      id: uri,
      name: 'Receipt',
      issuer: iss,
      subject: sub,
      issued: moment.unix(iat).toISOString(),
      signature_algorithm: alg,
      transparency_algorithm: vds,
      content_type: 'application/cose',
      labels: ['scitt-receipt'],
    }
    nodes[receipt.id] = receipt
    if (vdp === 'RFC9162-Inclusion-Proof') {
      vdp = 'Inclusion Proof'
    }
    const edge = {
      source: receipt.id,
      label: vdp,
      target: statement.id
    }
    edges.push(edge)
  })

  return {
    nodes: nodes,
    edges: edges
  }
}