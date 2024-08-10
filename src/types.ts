

export type PositionalArguments = string[]

export type JoseOptions = {
  alg?: string
  crv?: string
}

export type CommonOptions = {
  verbose?: boolean
}

export type Options = CommonOptions & JoseOptions

export type Arguments = { positionals: PositionalArguments, values: Options }