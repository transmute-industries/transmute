


import { contexts } from "./contexts"

export const defaultContext = {
  "@context": {
    "@vocab": "https://jsld.org/default#"
  }
}

export const documentLoader = async (iri) => {

  if (contexts[iri]) {
    return { document: contexts[iri] }
  }

  console.log('Unsupported iri: ' + iri)

  return { document: defaultContext }
}

