
import { CommonOptions, JoseOptions, ScittOptions, VcwgOptions } from './action/args'

export type PositionalArguments = string[]

export type Options = CommonOptions & JoseOptions & ScittOptions & VcwgOptions

export type Arguments = { positionals: PositionalArguments, values: Options }

export type JsonGraphNode = {
  id: string
  labels: string[]
} & Record<string, any>

export type JsonGraphEdge = {
  source: string
  label: string
  target: string
}

export type JsonGraph = {
  nodes: Record<string, JsonGraphNode>
  edges: JsonGraphEdge[]
}

export type QuadValue = {
  termType: 'NamedNode' | 'BlankNode' | string
  value: string
}

export type Quad = {
  subject: QuadValue
  predicate: QuadValue
  object: QuadValue
  graph: QuadValue
} & Record<string, QuadValue>

export type DocumentLoader = (id: string) => Promise<object>

export type RequestHmacCanonize = {
  signer: { sign: (bytes: Uint8Array) => Promise<Uint8Array> }
  labels?: Map<string, string>
  document: object
  documentLoader: DocumentLoader
}

export type RequestSignedBlankNodeComponents = {
  quad: Quad
  signer: { sign: (value: string) => Promise<string> }
}