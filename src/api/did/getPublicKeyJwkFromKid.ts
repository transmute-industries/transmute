
import transmute, { DidJwkUrl } from "@transmute/did-transmute"
import { DidWebUrl } from "@transmute/did-transmute/dist/did-web/types"
import axios from "axios"

const getPublicKeyJwkFromKid = async (kid: string) => {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let publicKeyJwk: any = null
  if (kid.startsWith('did:jwk')) {
    const doc = await transmute.did.jwk.dereference({
      id: kid as DidJwkUrl,
      documentLoader: transmute.did.jwk.documentLoader
    })
    publicKeyJwk = doc.publicKeyJwk
  }
  if (kid.startsWith('did:web')) {
    const doc = await transmute.did.web.dereference({
      id: kid as DidWebUrl,
      documentLoader: async (id: string) => {
        if (id.startsWith('https://scitt.xyz')) {
          const response = await axios.get(id)
          return { document: response.data }
        }
        throw new Error('Unsupported did:web')
      }
    })
    if (doc) {
      publicKeyJwk = doc.publicKeyJwk
    }
  }
  return publicKeyJwk
}

export default getPublicKeyJwkFromKid