import {QuadValue} from './QuadValue'
export type Quad = {
  subject: QuadValue
  predicate: QuadValue
  object: QuadValue
  graph: QuadValue
} & Record<string, QuadValue>