const pack = require('../../../package.json');

const { constructDIDPublicKeyID, createWallet, openpgpExtensions } = require('../../index');

const linkedData = {
  '@context': 'https://w3id.org/identity/v1',
  title: 'Hello World!',
};

const setup = async () => {
  const actor = 'A';
  const wallet = await createWallet();
  const keypair = await openpgpExtensions.cryptoHelpers.generateArmoredKeypair({
    name: actor,
    passphrase: actor,
  });
  const did = `did:test:${actor}`;
  await wallet.addKey(keypair, 'assymetric', {
    version: `openpgp@${pack.dependencies.openpgp}`,
    tags: ['OpenPGP.js', 'macbook pro'],
    notes: 'created for testing purposes',
    did: {
      primaryKeyOf: did,
      publicKey: true,
      authentication: true,
      publicKeyType: 'publicKeyPem',
      signatureType: 'Secp256k1VerificationKey2018',
    },
  });
  const firstKey = Object.keys(wallet.data.keystore)[0];
  const proofSet = [{ kid: constructDIDPublicKeyID(did, firstKey), password: actor }];
  // make sure local resolver has this did
  await wallet.toDIDDocument({
    did,
    proofSet,
    cacheLocal: true,
  });
  return {
    did,
    wallet,
    proofSet,
  };
};

describe('didRevocation', () => {
  it('new keys are not revoked', async () => {
    const { wallet, proofSet } = await setup();
    const signedLinkedData = await wallet.createSignedLinkedData({
      data: linkedData,
      proofSet,
    });
    const result = await wallet.verifySignedLinkedData({
      signedLinkedData: signedLinkedData.data,
    });
    expect(result.verified).toBe(true);
  });

  it('cannot revoke a key in a proofSet', async () => {
    expect.assertions(1);
    const { did, wallet, proofSet } = await setup();
    const firstKey = Object.keys(wallet.data.keystore)[0];
    try {
      await wallet.revoke({
        did,
        kid: firstKey,
        proofSet,
      });
    } catch (e) {
      expect(e.message).toEqual('Cannot revoke a key in a proofSet.');
    }
  });

  it('removed keys are revoked', async () => {
    const actor = 'B';
    const { did, wallet, proofSet } = await setup();
    const signedLinkedData = await wallet.createSignedLinkedData({
      data: linkedData,
      proofSet,
    });
    const results = await wallet.verifySignedLinkedData({
      signedLinkedData: signedLinkedData.data,
    });
    expect(results.verified).toBe(true);
    const oldfirstKey = Object.keys(wallet.data.keystore)[0];
    const keypair = await openpgpExtensions.cryptoHelpers.generateArmoredKeypair({
      name: actor,
      passphrase: actor,
    });
    await wallet.addKey(keypair, 'assymetric', {
      version: `openpgp@${pack.dependencies.openpgp}`,
      tags: ['OpenPGP.js', 'macbook pro'],
      notes: 'created for testing purposes',
      did: {
        primaryKeyOf: did,
        publicKey: true,
        authentication: true,
        publicKeyType: 'publicKeyPem',
        signatureType: 'Secp256k1VerificationKey2018',
      },
    });

    // eslint-disable-next-line
    const newfirstKey = Object.keys(wallet.data.keystore)[1];

    await wallet.revoke({
      did,
      kid: oldfirstKey,
      proofSet: [{ kid: constructDIDPublicKeyID(did, newfirstKey), password: actor }],
    });

    // try to verify a signature for a did key that has been
    // removed from the local resolver
    // eslint-disable-next-line
    result = await wallet.verifySignedLinkedData({
      signedLinkedData: signedLinkedData.data,
    });
    // eslint-disable-next-line
    expect(result.verified).toBe(false);
  });
});
