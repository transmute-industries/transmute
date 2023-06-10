export * from './QuadValue'
export * from './Quad'
export * from './RequestSignedBlankNodeComponents'
export * from './DocumentLoader'
export * from './RequestHmacCanonize'
export * from './DataIntegrityDocument'

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
