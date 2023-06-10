// import axios from 'axios';
import contexts from './contexts'

const documentLoader = async (iri) => {
  if (contexts[iri]) {
    return { document: contexts[iri] }
  }
  // const response = await axios.get(iri);
  // const doc = response.data;
  // if (doc) {
  //   return {document: doc};
  // }
  throw new Error('Unsupported iri: ' + iri)
}

export default documentLoader
