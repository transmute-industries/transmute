
import { CommonOptions, JoseOptions, ScittOptions, VcwgOptions } from './action/args'

export type PositionalArguments = string[]

export type Options = CommonOptions & JoseOptions & ScittOptions & VcwgOptions

export type Arguments = { positionals: PositionalArguments, values: Options }