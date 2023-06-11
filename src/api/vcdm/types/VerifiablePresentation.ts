import { Context } from './Context'
import { Proof} from './Proof'
export interface VerifiablePresentation {
  '@context': Context
  type: string | string[]
  holder?: string | object
  verifiableCredential?: object | Array<string | object>
  proof?: Proof | Proof[]
}
