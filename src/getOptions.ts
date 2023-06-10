import * as core from '@actions/core';

import { ActionOptions } from './types'

const getOptions = (): ActionOptions => {
  return {
    json: core.getInput("json"),
    // from .env
    neo4jUri: core.getInput("neo4j-uri"),
    // neo4j-uri: ${{ secrets.NEO4J_URI }}
    neo4jUser: core.getInput("neo4j-user"),
    // neo4j-user: ${{ secrets.NEO4J_USERNAME }}
    neo4jPassword: core.getInput("neo4j-password"),
    // neo4j-password: ${{ secrets.NEO4J_PASSWORD }}

  };
};

export default getOptions;