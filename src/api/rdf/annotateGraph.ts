import { JsonGraph } from './types'
import _ from 'lodash'

const getLabelFromIri = (iri) => {
  return _.startCase(iri.split('/').pop().split('#').pop())
}

const predicatesNotLabels = [
  'https://www.w3.org/2018/credentials#verifiableCredential',
]

const addLabelsFromEdge = (
  graph: JsonGraph,
  nodeSide: string,
  predicate: string,
  edgeSide: string,
) => {
  const edges = graph.edges.filter((e) => {
    return e.label === predicate
  })
  edges.forEach((edge) => {
    const node = graph.nodes[edge[nodeSide]]
    node.labels = node.labels.filter((label) => label !== 'Node')
    const label = edge[edgeSide]
    node.labels.push(label)
  })
}

const removeRdfTypes = (graph: JsonGraph) => {
  const edges = graph.edges.filter((e) => {
    return e.label === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
  })
  edges.forEach((edge) => {
    const node = graph.nodes[edge.source]
    node.labels = node.labels.filter((label) => label !== 'Node')
    node.labels.push(edge.target)
    // node[edge.label] = edge.target;
    // remove type node
    delete graph.nodes[edge.target]
    // remove type edge
    const edgeIndex = graph.edges.findIndex((e) => {
      return JSON.stringify(e) === JSON.stringify(edge)
    })
    graph.edges.splice(edgeIndex, 1)
  })
}

const readableEdges = (graph: JsonGraph) => {
  graph.edges = graph.edges.map((edge) => {
    return {
      ...edge,
      label: getLabelFromIri(edge.label),
      predicate: edge.label,
    }
  })
}

const addVCDMVocab = (graph: JsonGraph) => {
  graph.edges.forEach((edge) => {
    if (edge.label && edge.label.startsWith('https://www.w3.org/2018/credentials')) {
      if (!predicatesNotLabels.includes(edge.label)) {
        addLabelsFromEdge(graph, 'target', edge.label, 'label')
      }
    }
    if (edge.label && edge.label.startsWith('https://www.w3.org/ns/credentials/examples')) {
      if (!predicatesNotLabels.includes(edge.label)) {
        addLabelsFromEdge(graph, 'target', edge.label, 'label')
      }
    }
    if (edge.label && edge.label.startsWith('https://w3id.org/security')) {
      if (edge.target && edge.target.startsWith('https://w3id.org/security')) {
        addLabelsFromEdge(graph, 'target', edge.label, 'target')
      } else {
        addLabelsFromEdge(graph, 'target', edge.label, 'label')
      }
    }
  })
}

const annotateGraph = (graph: JsonGraph): JsonGraph => {
  addVCDMVocab(graph)
  removeRdfTypes(graph)
  readableEdges(graph)
  return graph
}

export default annotateGraph
