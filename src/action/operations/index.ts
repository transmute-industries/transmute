import { ActionOptions } from '../ActionOptions'

import * as neo4j from './neo4j'

const operations = async (options: ActionOptions) => {
  if (options.neo4jUri) {
    return neo4j.run(options)
  }
}

export default operations