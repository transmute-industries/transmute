import { cbor } from "@transmute/cose";
import { JsonGraph, JsonGraphEdge, JsonGraphNode } from "../../types";

export const collate = async (data: Uint8Array, inputType = 'application/cose', outputType = 'application/vnd.jgf+json'): Promise<JsonGraph> => {

  const decoded = cbor.decode(data)
  if (decoded.tag !== 18) {
    throw new Error('Only cose-sign1 / tag 18 is supported.')
  }

  const id = `data:${inputType};base64,${Buffer.from(data).toString('base64')}`
  const header = cbor.decode(decoded.value[0])
  const payload = decoded.value[2].toString('hex')
  const sig = header.get(1)
  const hash = header.get(-6800)

  const nodes = {} as Record<string, JsonGraphNode>;
  const edges = [] as JsonGraphEdge[]
  const statement = {
    id,
    hash_value: payload,
    hash_algorithm: hash,
    signature_algorithm: sig,
    content_type: ['application/cose'],
    labels: ['scitt-transparent-statement']
  };
  nodes[statement.id] = statement;
  (decoded.value[1].get(394) || []).map((r) => {
    const receipt = cbor.decode(r)
    const header = cbor.decode(receipt.value[0])
    const alg = header.get(1)
    const vds = header.get(395)
    const vdp = receipt.value[1].get(396).get(-1) ? 'inclusion' : 'consistency'
    const id = `data:${inputType};base64,${Buffer.from(r).toString('base64')}`
    const node = {
      id,
      signature_algorithm: alg,
      transparency_algorithm: vds,
      labels: ['scitt-receipt']
    }
    nodes[node.id] = node
    const edge = {
      source: id,
      label: `${vdp}-receipt`,
      target: statement.id
    }
    edges.push(edge)
  })

  return {
    nodes: nodes,
    edges: edges
  }
}