
import { CommonOptions, JoseOptions } from './action/args'

export type PositionalArguments = string[]

export type Options = CommonOptions & JoseOptions

export type Arguments = { positionals: PositionalArguments, values: Options }