/* eslint-disable @typescript-eslint/no-var-requires */
import operationSwitch from "../src/operationSwitch";


it.skip("render enveloped presentation graph", async () => {
  const presentation = {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2"
    ],
    "type": "VerifiablePresentation",
    "workflow": {
      "definition": [
        "urn:definition:steel-import"
      ],
      "instance": [
        "urn:instance:steel-import-from-customs-broker-123"
      ]
    },
    "verifiableCredential": [
      {
        "@context": "https://www.w3.org/ns/credentials/v2",
        "id": "data:application/vc+ld+json+jwt;eyJraWQiOiJFeEhrQk1XOWZtYmt2VjI2Nm1ScHVQMnNVWV9OX0VXSU4xbGFwVXpPOHJvIiwiYWxnIjoiRVMzODQifQ.eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvdjIiLCJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvZXhhbXBsZXMvdjIiXSwiaWQiOiJodHRwOi8vdW5pdmVyc2l0eS5leGFtcGxlL2NyZWRlbnRpYWxzLzE4NzIiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiRXhhbXBsZUFsdW1uaUNyZWRlbnRpYWwiXSwiaXNzdWVyIjoiaHR0cHM6Ly91bml2ZXJzaXR5LmV4YW1wbGUvaXNzdWVycy81NjUwNDkiLCJ2YWxpZEZyb20iOiIyMDEwLTAxLTAxVDE5OjIzOjI0WiIsImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2V4YW1wbGUub3JnL2V4YW1wbGVzL2RlZ3JlZS5qc29uIiwidHlwZSI6Ikpzb25TY2hlbWEifSwiY3JlZGVudGlhbFN1YmplY3QiOnsiaWQiOiJkaWQ6ZXhhbXBsZToxMjMiLCJkZWdyZWUiOnsidHlwZSI6IkJhY2hlbG9yRGVncmVlIiwibmFtZSI6IkJhY2hlbG9yIG9mIFNjaWVuY2UgYW5kIEFydHMifX19.PlDaPu6DCxS8G2X7tBcVL7FafHDfEKP91TIS4TL-chav-0cxLCxMCnYbOlnkwLdyr0JoW0E4cNrlC2xwTlJDYS9zHfBl9nzbQ1lIBdJ-oWxXyevaDnqcf1E0RER-sZ-n",
        "type": "EnvelopedVerifiableCredential"
      }
    ]
  }
  await operationSwitch({
    json: `${JSON.stringify(presentation, null, 2)}`,
    neo4jUri: process.env.NEO4J_URI,
    neo4jUser: process.env.NEO4J_USERNAME,
    neo4jPassword: process.env.NEO4J_PASSWORD
  });
});
