import { base64url } from 'jose'

const encoder = new TextEncoder()

export type RequestBlankNodeSigner = {
  labels?: Map<string, string>
  signer: { sign: (bytes: Uint8Array) => Promise<Uint8Array> }
}

export const remoteBlankNodeSigner = async ({
  labels,
  signer,
}: RequestBlankNodeSigner): Promise<{
  sign: (value: string) => Promise<string>
}> => {
  return labels
    ? {
      sign: async (label: string) => `_:${labels.get(label.slice(2))}`,
    }
    : {
      sign: async (label: string) => {
        const bytes = encoder.encode(label.slice(2))
        const hashed = await signer.sign(bytes)
        // sad multibase pollution
        return `_:u${base64url.encode(hashed)}`
      },
    }
}
