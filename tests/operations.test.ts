/* eslint-disable @typescript-eslint/no-var-requires */

import operationSwitch from "../src/operationSwitch";

describe.skip("operations", () => {
  it("minimal credential", async () => {
    const result = await operationSwitch({
      json: `${JSON.stringify(require('../src/__fixtures__/_minimal-credential.json'), null, 2)}`,
      neo4jUri: process.env.NEO4J_URI,
      neo4jUser: process.env.NEO4J_USERNAME,
      neo4jPassword: process.env.NEO4J_PASSWORD
    });
    expect(result).toBeDefined()
  });
  it("minimal presentation", async () => {
    const result = await operationSwitch({
      json: `${JSON.stringify(require('../src/__fixtures__/_minimal-presentation.json'), null, 2)}`,
      neo4jUri: process.env.NEO4J_URI,
      neo4jUser: process.env.NEO4J_USERNAME,
      neo4jPassword: process.env.NEO4J_PASSWORD
    });
    expect(result).toBeDefined()
  });
  it("vc with proof", async () => {
    const result = await operationSwitch({
      json: `${JSON.stringify(require('../src/__fixtures__/vc-with-proof.json'), null, 2)}`,
      neo4jUri: process.env.NEO4J_URI,
      neo4jUser: process.env.NEO4J_USERNAME,
      neo4jPassword: process.env.NEO4J_PASSWORD
    });
    expect(result).toBeDefined()
  });
  it("vp with proof", async () => {
    const result = await operationSwitch({
      json: `${JSON.stringify(require('../src/__fixtures__/vp-with-proof.json'), null, 2)}`,
      neo4jUri: process.env.NEO4J_URI,
      neo4jUser: process.env.NEO4J_USERNAME,
      neo4jPassword: process.env.NEO4J_PASSWORD
    });
    expect(result).toBeDefined()
  });

  it("vp with location", async () => {
    const result = await operationSwitch({
      json: `${JSON.stringify(require('../src/__fixtures__/vp-with-location.json'), null, 2)}`,
      neo4jUri: process.env.NEO4J_URI,
      neo4jUser: process.env.NEO4J_USERNAME,
      neo4jPassword: process.env.NEO4J_PASSWORD
    });
    expect(result).toBeDefined()
 

  });
  it("google example", async () => {
    const result = await operationSwitch({
      json: `${JSON.stringify(require('../src/__fixtures__/google-example.json'), null, 2)}`,
      neo4jUri: process.env.NEO4J_URI,
      neo4jUser: process.env.NEO4J_USERNAME,
      neo4jPassword: process.env.NEO4J_PASSWORD
    });
    expect(result).toBeDefined()
  });
});
