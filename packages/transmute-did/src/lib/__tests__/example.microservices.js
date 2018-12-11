const _ = require('lodash');
const base64url = require('base64url');
const testParams = require('./testParams');

const verifyInvocation = async (invocation, capabilities, actors) => {
  const resolver = {
    resolve: async (did) => {
      const { data } = await actors[did].wallet.toDIDDocument({
        did,
        proofSet: actors[did].proofSet,
      });
      // console.log(did, actors[did].proofSet)
      return Promise.resolve(data);
    },
  };
  const verifications = [];
  const isInvocationSignatureGood = await actors['did:test:C'].wallet.verifySignedLinkedData({
    signedLinkedData: invocation,
    resolver,
  });
  if (!isInvocationSignatureGood.verified) {
    throw new Error('Invocation signature failed verification');
  }
  verifications.push(invocation.id);
  let cap = capabilities[invocation.proclamation];
  let chainVerificationFailure = false;

  while (cap && !chainVerificationFailure) {
    // eslint-disable-next-line
    const isCapabilitySignatureGood = await actors['did:test:C'].wallet.verifySignedLinkedData({
      signedLinkedData: cap,
      resolver,
    });
    if (!isCapabilitySignatureGood.verified) {
      chainVerificationFailure = true;
    }
    verifications.push(cap.id);
    cap = capabilities[cap.parent];
  }
  return !chainVerificationFailure;
};

// https://github.com/WebOfTrustInfo/rebooting-the-web-of-trust-fall2017/blob/master/final-documents/lds-ocap.md
describe('Micro Services OCAP-LD Flow', () => {
  let actors;
  const capabilities = {};
  const invocations = {};
  beforeAll(async () => {
    actors = await testParams();
  });

  it('cloud storage service grants alice access', async () => {
    const result = await actors['did:test:C'].wallet.createSignedLinkedData({
      data: {
        '@context': [
          'https://example.org/did/v1',
          'https://example.org/ocap/v1',
          'http://schema.org',
        ],
        id: 'did:test:aliceCanAccessCloudStorage',
        type: 'Proclamation',
        subject: 'did:test:C',
        grantedKey: actors['did:test:A'].didDocument.publicKey[0].id,
        caveat: [],
      },
      proofSet: actors['did:test:C'].proofSet,
    });
    capabilities[result.data.id] = result.data;
    expect(capabilities[result.data.id]).toBeDefined();
  });

  it('alice delegates access to bob', async () => {
    const result = await actors['did:test:A'].wallet.createSignedLinkedData({
      data: {
        '@context': [
          'https://example.org/did/v1',
          'https://example.org/ocap/v1',
          'http://schema.org',
        ],
        id: 'did:test:bobCanAccessCloudStorage',
        type: 'Proclamation',
        parent: capabilities['did:test:aliceCanAccessCloudStorage'].id,
        grantedKey: actors['did:test:B'].didDocument.publicKey[0].id,
        caveat: [
          {
            id: 'did:test:bobCanAccessCloudStorage#caveats/upload-only',
            type: 'RestrictToMethod',
            method: 'UploadFile',
          },
          {
            id: 'did:test:bobCanAccessCloudStorage#caveats/50-megs-only',
            type: 'RestrictUploadSize',
            limit: 52428800,
          },
        ],
      },
      proofSet: actors['did:test:A'].proofSet,
    });
    capabilities[result.data.id] = result.data;
    expect(capabilities[result.data.id]).toBeDefined();
  });

  it('bob delegates access to dummy server', async () => {
    const result = await actors['did:test:B'].wallet.createSignedLinkedData({
      data: {
        '@context': [
          'https://example.org/did/v1',
          'https://example.org/ocap/v1',
          'http://schema.org',
        ],
        id: 'did:test:dummyCanAccessCloudStorage',
        type: 'Proclamation',
        parent: capabilities['did:test:bobCanAccessCloudStorage'].id,
        grantedKey: actors['did:test:D'].didDocument.publicKey[0].id,
        caveat: [
          {
            id: 'did:test:dummyCanAccessCloudStorage#caveats/expire-time',
            type: 'ExpireTime',
            date: '2017-09-23T20:21:34Z',
          },
        ],
      },
      proofSet: actors['did:test:B'].proofSet,
    });
    capabilities[result.data.id] = result.data;
    expect(capabilities[result.data.id]).toBeDefined();
  });

  it('dummy can create invocation of a capability', async () => {
    const result = await actors['did:test:D'].wallet.createSignedLinkedData({
      data: {
        '@context': [
          'https://example.org/did/v1',
          'https://example.org/ocap/v1',
          'http://schema.org',
        ],
        id: 'did:test:dummyUploadsFileWithInvocationOfCapability',
        type: 'Invocation',
        // Dummy Bot is invoking the proclamation it has,
        // but the whole chain will be checked for attenuation and
        // verification of access
        proclamation: capabilities['did:test:dummyCanAccessCloudStorage'].id,
        method: 'UploadFile',
        usingKey: actors['did:test:D'].didDocument.publicKey[0].id,
        file: base64url('some plaintext from D'),
      },
      proofSet: actors['did:test:D'].proofSet,
    });
    invocations[result.data.id] = result.data;
    expect(invocations[result.data.id]).toBeDefined();
  });

  it('cloudStorage can verify invocation', async () => {
    const isInvocationValid = await verifyInvocation(
      invocations['did:test:dummyUploadsFileWithInvocationOfCapability'],
      capabilities,
      actors,
    );
    expect(isInvocationValid).toBe(true);
  });

  it('cloudStorage can NOT verify invocation when a key has been revoked.', async () => {
    // remove the key from the proofSet first
    // this is only necessar because our resolver uses the wallets for testing.
    actors['did:test:B'].proofSet = _.reject(
      actors['did:test:B'].proofSet,
      p => p.kid === actors['did:test:B'].didDocument.publicKey[0].id,
    );

    await actors['did:test:B'].wallet.revoke({
      did: 'did:test:B',
      kid: actors['did:test:B'].didDocument.publicKey[0].id,
      proofSet: [{ kid: actors['did:test:B'].didDocument.publicKey[1].id, password: 'B' }],
    });

    const isInvocationValid = await verifyInvocation(
      invocations['did:test:dummyUploadsFileWithInvocationOfCapability'],
      capabilities,
      actors,
    );

    expect(isInvocationValid).toBe(false);
  });
});
