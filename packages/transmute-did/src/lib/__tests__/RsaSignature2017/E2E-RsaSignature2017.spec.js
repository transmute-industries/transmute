const RsaSignature2017 = require('@transmute/rsasignature2017');

const {
  createWallet,
  constructDIDPublicKeyID,
  DIDLinkedDataSignatureVerifier,
} = require('../../../index');

const linkedData = {
  '@context': 'https://w3id.org/identity/v1',
  givenName: 'Alice',
};

jest.setTimeout(10000);

describe('RsaSignature2017', () => {
  let wallet;
  let kid;
  const did = 'did:example:123';
  let didDocument;
  it('can create a wallet with RSA keys', async () => {
    wallet = await createWallet();
    const keypair = RsaSignature2017.generateRSAKeypair();
    await wallet.addKey(
      {
        publicKey: keypair.public,
        privateKey: keypair.private,
      },
      'assymetric',
      {
        tags: ['RsaSignature2017', 'Mastodon'],
        notes: 'created for testing purposes',
        did: {
          publicKey: true,
          authentication: true,
          publicKeyType: 'publicKeyPem',
          signatureType: 'RsaSignature2017',
        },
      },
    );
    // eslint-disable-next-line
    kid = Object.keys(wallet.data.keystore)[0];
    const firstKeystore = wallet.data.keystore[kid];
    expect(firstKeystore.data.publicKey).toBe(keypair.public);
  });
  it('can create a DID Document', async () => {
    const result = await wallet.toDIDDocument({
      did,
      cacheLocal: true,
    });
    didDocument = result.data;
    expect(didDocument.publicKey[0].type).toBe('RsaSignature2017');
  });

  it('can sign and verify with wallet', async () => {
    const signed = await RsaSignature2017.sign({
      data: linkedData,
      domain: 'example.com',
      creator: constructDIDPublicKeyID(did, kid),
      privateKey: wallet.data.keystore[kid].data.privateKey,
    });
    const verified = await RsaSignature2017.verify({
      data: signed,
      publicKey: wallet.data.keystore[kid].data.publicKey,
    });
    expect(signed.signature.domain).toBe('example.com');
    expect(verified).toBe(true);
  });

  it('can verify with resolver', async () => {
    const signed = await RsaSignature2017.sign({
      data: linkedData,
      domain: 'example.com',
      creator: constructDIDPublicKeyID(did, kid),
      privateKey: wallet.data.keystore[kid].data.privateKey,
    });

    const verified = await DIDLinkedDataSignatureVerifier.verifyLinkedDataWithDIDResolver({
      data: signed,
      resolver: wallet.resolver,
      verify: RsaSignature2017.verify,
    });

    expect(verified).toBe(true);
  });

  it('fails to verify when a key is revoked (removed from DID Document)', async () => {
    expect.assertions(1);
    const signed = await RsaSignature2017.sign({
      data: linkedData,
      domain: 'example.com',
      creator: constructDIDPublicKeyID(did, kid),
      privateKey: wallet.data.keystore[kid].data.privateKey,
    });

    // delete keystore
    wallet.data.keystore = {};
    try {
      await wallet.toDIDDocument({
        did,
        cacheLocal: true,
      });

      await DIDLinkedDataSignatureVerifier.verifyLinkedDataWithDIDResolver({
        data: signed,
        resolver: wallet.resolver,
        verify: RsaSignature2017.verify,
      });
    } catch (e) {
      expect(e.message).toBe(
        'Creator key is not present in resolved DID Document. Catch this error and consider the key revoked.',
      );
    }
  });
});
