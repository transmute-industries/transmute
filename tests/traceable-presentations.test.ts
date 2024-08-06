/* eslint-disable @typescript-eslint/no-var-requires */
import operationSwitch from "../src/operationSwitch";

import * as jose from 'jose'
import * as transmute from "@transmute/verifiable-credentials";

it.skip("simple", async () => {
  const alg = 'ES256'
  const issuer = 'did:web:gbi.vendor.example'
  const issuerPrivateKey = await transmute.key.generate({
    alg,
    type: "application/jwk+json",
  });
  const subject = 'did:web:logistics.example'
  const holderPrivateKey = await transmute.key.generate({
    alg,
    type: "application/jwk+json",
  });

  const issued = await transmute
    .issuer({
      alg,
      type: "application/vc+ld+json+jwt",
      signer: {
        sign: async (bytes: Uint8Array) => {
          const jws = await new jose.CompactSign(bytes)
            .setProtectedHeader({ kid: `${issuer}#assertion-key`, alg })
            .sign(
              await transmute.key.importKeyLike({
                type: "application/jwk+json",
                content: issuerPrivateKey,
              })
            );
          return transmute.text.encoder.encode(jws);
        },
      },
    })
    .issue({
      claimset: transmute.text.encoder.encode(`
"@context":
  - https://www.w3.org/ns/credentials/v2
id: urn:uuid:f9e95eb8-1ed0-46b8-a6bf-c46539aef6c9
type:
  - VerifiableCredential
issuer:
  id: ${issuer}
  name: "GBI Issuer"
validFrom: 2024-08-06T19:35:57.505Z
credentialSubject:
  id: ${subject}
`),
    });

  const presentation = await transmute
    .holder({
      alg,
      type: "application/vp+ld+json+jwt",
    })
    .issue({
      signer: {
        sign: async (bytes: Uint8Array) => {
          const jws = await new jose.CompactSign(bytes)
            .setProtectedHeader({ kid: `${subject}#authentication-key`, alg })
            .sign(
              await transmute.key.importKeyLike({
                type: "application/jwk+json",
                content: holderPrivateKey,
              })
            );
          return transmute.text.encoder.encode(jws);
        },
      },
      presentation: {
        "@context": ["https://www.w3.org/ns/credentials/v2"],
        type: ["VerifiablePresentation"],
        holder: `${subject}`,
        // this part is built from disclosures without key binding below.
        // "verifiableCredential": [{
        //   "@context": "https://www.w3.org/ns/credentials/v2",
        //   "id": "data:application/vc+ld+json+sd-jwt;QzVjV...RMjU",
        //   "type": "EnvelopedVerifiableCredential"
        // }]
      },
      disclosures: [
        {
          type: `application/vc+ld+json+jwt`,
          credential: issued,
        },
      ],
    });

  await operationSwitch({
    json: `${JSON.stringify({ jwt: new TextDecoder().decode(presentation) }, null, 2)}`,
    neo4jUri: process.env.NEO4J_URI,
    neo4jUser: process.env.NEO4J_USERNAME,
    neo4jPassword: process.env.NEO4J_PASSWORD
  });

});
