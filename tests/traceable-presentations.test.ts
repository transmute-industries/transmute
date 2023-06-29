/* eslint-disable @typescript-eslint/no-var-requires */
import operationSwitch from "../src/operationSwitch";

import fs from 'fs'

const context = [
  "https://www.w3.org/ns/credentials/v2",
  {
    "replaces": {
      "@id": "https://w3id.org/traceability#replaces",
      "@type": "@id"
    },
    "patch": {
      "@id": "https://datatracker.ietf.org/doc/rfc6902#section-4",
      "@type": "@json"
    },
    "workflow": {
      "@context": {
        "definition": {
          "@id": "https://w3id.org/traceability#definition",
          "@type": "@id"
        },
        "instance": {
          "@id": "https://w3id.org/traceability#instance",
          "@type": "@id"
        }
      }
    }
  }
]
const type = [
  "VerifiablePresentation",
  "TraceablePresentation"
]
const workflow = {
  "definition": [
    "urn:definition:steel-import"
  ],
  "instance": [
    "urn:instance:steel-import-from-customs-broker-123"
  ]
}

it("simple", async () => {
  const presentationWithErrors = { '@context': context, id: 'urn:uuid:1111', type, workflow, name: 'alcie' }
  const presentationWithCorrections = {
    '@context': context, id: 'urn:uuid:2222', replaces: {
      id: 'urn:uuid:1111',
      type
    }, type, workflow, name: 'alice'
  }
  await operationSwitch({
    json: `${JSON.stringify(presentationWithErrors, null, 2)}`,
    neo4jUri: process.env.NEO4J_URI,
    neo4jUser: process.env.NEO4J_USERNAME,
    neo4jPassword: process.env.NEO4J_PASSWORD
  });
  await operationSwitch({
    json: `${JSON.stringify(presentationWithCorrections, null, 2)}`,
    neo4jUri: process.env.NEO4J_URI,
    neo4jUser: process.env.NEO4J_USERNAME,
    neo4jPassword: process.env.NEO4J_PASSWORD
  });
  fs.writeFileSync('examples/neo4j/simple-presentation-with-errors.json', JSON.stringify(presentationWithErrors, null, 2))
  fs.writeFileSync('examples/neo4j/simple-presentation-making-corrections.json', JSON.stringify(presentationWithCorrections, null, 2))
});
