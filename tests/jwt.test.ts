/* eslint-disable @typescript-eslint/no-var-requires */

import operationSwitch from "../src/operationSwitch";

describe.skip("operations", () => {
  it("minimal credential", async () => {
    const result = await operationSwitch({
      json: `${JSON.stringify(require('../src/__fixtures__/_minimal-credential.proof.json'), null, 2)}`,
      neo4jUri: process.env.NEO4J_URI,
      neo4jUser: process.env.NEO4J_USERNAME,
      neo4jPassword: process.env.NEO4J_PASSWORD
    });
    expect(result).toBeDefined()
  });
  
});
