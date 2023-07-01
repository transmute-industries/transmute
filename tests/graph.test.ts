import transmute from '@transmute/did-transmute';
import api from '../src/api/rdf/jsongraph'

describe("graph", () => {
  it("from did document", async () => {
    const { did } = await transmute.did.jwk.exportable({ alg: 'ES384' })
    const doc = await transmute.did.jwk.resolve({
      id: did,
      documentLoader: transmute.did.jwk.documentLoader
    })
    const graph = await api.fromDocument(doc)
    expect(graph).toBeDefined()
  });
});
