

import VerifiableDataPlatform from '@transmute/sdk'
import { getInput } from '@actions/core'

export const getApi = async () => {
  return await VerifiableDataPlatform.fromEnv({
    CLIENT_ID: `${process.env.CLIENT_ID || getInput("transmute-client-id")}`,
    CLIENT_SECRET: `${process.env.CLIENT_SECRET || getInput("transmute-client-secret")}`,
    API_BASE_URL: `${process.env.API_BASE_URL || getInput("transmute-api")}`,
    TOKEN_AUDIENCE: `${process.env.API_BASE_URL || getInput("transmute-api")}`,
  })
}

export const getPresentations = async ({ sent, received, api }: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results: any = { items: [] }
  if (received) {
    const response = await api.presentations.getPresentationsSharedWithMe()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = response.data as any
    if (response.data) {
      results.page = data.page
      results.count = data.count
      results.items = [
        ...results.items,
        ...data.items.map((p) => {
          return { id: p.id, content: p.verifiablePresentation }
        }),
      ]
    }
  }
  if (sent) {
    const response = await api.presentations.getPresentationsSharedWithOthers()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = response.data as any
    if (response.data) {
      results.page = data.page
      results.count = data.count
      results.items = [
        ...results.items,
        ...data.items.map((p) => {
          return { id: p.id, content: p.verifiablePresentation }
        }),
      ]
    }
    // in case both are passed, these values don't make sense...
    if (received) {
      delete results.page
      delete results.count
    }
  }
  return results
}