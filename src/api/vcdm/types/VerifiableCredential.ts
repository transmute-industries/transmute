import { Context } from './Context'
import { Proof} from './Proof'
export interface VerifiableCredential {
  '@context': Context
  issuer: string | object
  validFrom: string
  credentialSubject: object
  proof?: Proof | Proof[]
}
