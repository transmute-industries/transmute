const _ = require('lodash');
const stringify = require('json-stringify-deterministic');
const testParams = require('./testParams');

describe('Supply Chain DID OCAP-LD Flow', () => {
  let actors;
  let resolver;
  const capabilities = {};

  beforeAll(async () => {
    actors = await testParams();
    resolver = {
      resolve: async (did) => {
        const { data } = await actors[did].wallet.toDIDDocument({
          did,
          proofSet: actors[did].proofSet,
        });
        return Promise.resolve(data);
      },
    };
  });

  it('Charlie certifies Alice can transport biohazard, then Bob countersigns', async () => {
    let result = await actors['did:test:C'].wallet.createSignedLinkedData({
      data: {
        '@context': ['https://example.org/did/v1', 'http://schema.org'],
        id: 'did:test:aliceCanTransportBiohazard',
        type: 'Proclamation',
        subject: 'did:test:C',
        grantedKey: actors['did:test:A'].didDocument.publicKey[0].id,
        caveat: [],
      },
      proofChain: [actors['did:test:C'].proofSet[0]],
    });
    capabilities[result.data.id] = result.data;

    result = await actors['did:test:B'].wallet.createSignedLinkedData({
      data: result.data,
      proofChain: [actors['did:test:B'].proofSet[0]],
    });
    capabilities[result.data.id] = result.data;

    const areNestedLinkedDataSignatureValid = await actors[
      'did:test:D'
    ].wallet.verifySignedLinkedData({
      signedLinkedData: result.data,
      resolver,
    });
    expect(areNestedLinkedDataSignatureValid.verified).toBe(true);

    // leave for debugging
    // console.log(stringify(result.data, null, 2));
  });

  it('Bob revokes his key invalidating the capability', async () => {
    actors['did:test:B'].proofSet = _.reject(
      actors['did:test:B'].proofSet,
      p => p.kid === actors['did:test:B'].didDocument.publicKey[0].id,
    );

    try {
      await actors['did:test:B'].wallet.revoke({
        did: 'did:test:B',
        kid: actors['did:test:B'].didDocument.publicKey[0].id,
        proofSet: actors['did:test:B'].proofSet,
      });

      const areNestedLinkedDataSignatureValid = await actors[
        'did:test:D'
      ].wallet.verifySignedLinkedData({
        signedLinkedData: capabilities['did:test:aliceCanTransportBiohazard'],
        resolver,
      });
      expect(areNestedLinkedDataSignatureValid.verified).toBe(false);
    } catch (e) {
      expect(e.message).toBe(
        'No primary key was found',
      );
    }
  });
});
