
import { CommonOptions, JoseOptions, ScittOptions } from './action/args'

export type PositionalArguments = string[]

export type Options = CommonOptions & JoseOptions & ScittOptions

export type Arguments = { positionals: PositionalArguments, values: Options }