import { Quad } from "./Quad"

export type RequestSignedBlankNodeComponents = {
  quad: Quad
  signer: { sign: (value: string) => Promise<string> }
}