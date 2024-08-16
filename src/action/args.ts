
import { parseArgs } from "node:util";

import { getInput } from '@actions/core'

import { env } from "./env";

export type JoseOptions = {
  iss?: string
  sub?: string
  kid?: string
  alg?: string
  enc?: string
  crv?: string
  compact?: boolean
}

export type CommonOptions = {
  output?: string
  verbose?: boolean
  detached?: boolean
  'content-type'?: string
}

export type VcwgOptions = {
  'graph-type'?: string
  'credential-type'?: string
  'presentation-type'?: string
  push?: boolean
  env?: string
}

export type ScittOptions = {
  log?: string,
  location?: string
  'azure-keyvault'?: boolean
}

export const args = (prompt: string) => {
  // https://stackoverflow.com/questions/29655760/convert-a-string-into-shell-arguments
  const re = /"[^"]+"|'[^']+'|\S+/g
  if (env.github() && !env.mock()) {
    prompt = getInput("transmute")
  }
  return parseArgs({
    allowPositionals: true,
    args: prompt.match(re) || [],
    options: {
      verbose: {
        type: 'boolean' as "boolean",
        short: 'v'
      },
      detached: {
        type: 'boolean' as "boolean",
        short: 'd'
      },
      compact: {
        type: 'boolean' as "boolean",
        short: 'c'
      },
      output: {
        type: 'string' as "string",
        short: 'o'
      },
      push: {
        type: 'boolean' as "boolean",
      },
      env: {
        type: 'string' as "string",
      },
      'credential-type': {
        type: 'string' as "string",
      },
      'presentation-type': {
        type: 'string' as "string",
      },
      'graph-type': {
        type: 'string' as "string",
      },
      'content-type': {
        type: 'string' as "string",
      },
      'location': {
        type: 'string' as "string",
      },
      'azure-keyvault': {
        type: 'boolean' as "boolean",
      },
      iss: {
        type: 'string' as "string",
      },
      sub: {
        type: 'string' as "string",
      },
      kid: {
        type: 'string' as "string",
      },
      alg: {
        type: 'string' as "string",
      },
      enc: {
        type: 'string' as "string",
      },
      crv: {
        type: 'string' as "string",
      },
      log: {
        type: 'string' as "string",
      },
    },
  })
}