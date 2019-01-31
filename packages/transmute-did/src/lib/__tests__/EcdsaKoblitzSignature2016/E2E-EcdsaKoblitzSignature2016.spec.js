const EcdsaKoblitzSignature2016 = require('@transmute/ecdsakoblitzsignature2016');

const {
  createWallet,
  constructDIDPublicKeyID,
  DIDLinkedDataSignatureVerifier,
} = require('../../../index');

const keypair = {
  publicKey: '02234be9bcdf041f7530979b8b88b7dc62dd505a75883c8211f3a8250534f96dc0',
  privateKey: '617e062ea82d0cc631bc6b315b444f2efb55319ea8e0b64f6f8a807ef7588e41',
};

const linkedData = {
  '@context': 'https://w3id.org/identity/v1',
  givenName: 'Alice',
};

jest.setTimeout(10000);

describe('EcdsaKoblitzSignature2016', () => {
  let wallet;
  let kid;
  const did = 'did:example:123';
  let didDocument;
  it('can create a wallet with Bitcoin keys', async () => {
    wallet = await createWallet();

    await wallet.addKey(
      {
        publicKey: keypair.publicKey,
        privateKey: keypair.privateKey,
      },
      'assymetric',
      {
        tags: ['EcdsaKoblitzSignature2016'],
        notes: 'created for testing purposes',
        did: {
          publicKey: true,
          authentication: true,
          publicKeyType: 'publicKeyHex',
          signatureType: 'EcdsaKoblitzSignature2016',
        },
      },
    );
    // eslint-disable-next-line
    kid = Object.keys(wallet.data.keystore)[0];
    const firstKeystore = wallet.data.keystore[kid];
    expect(firstKeystore.data.publicKey).toBe(keypair.publicKey);
  });

  it('can create and sign a DID Document ', async () => {
    const result = await wallet.toDIDDocument({
      did,
      cacheLocal: true,
    });
    didDocument = result.data;
    expect(didDocument.publicKey[0].type).toBe('EcdsaKoblitzSignature2016');

    const signed = await EcdsaKoblitzSignature2016.sign({
      data: didDocument,
      domain: 'example.com',
      signatureAttribute: 'proof',
      creator: constructDIDPublicKeyID(did, kid),
      privateKey: wallet.data.keystore[kid].data.privateKey,
    });

    const verified = await EcdsaKoblitzSignature2016.verify({
      data: { ...signed },
      signatureAttribute: 'proof',
      publicKey: wallet.data.keystore[kid].data.publicKey,
    });
    // console.log(verified)
    expect(signed.proof).toBeDefined();
    expect(verified).toBe(true);
  });

  it('can sign and verify with wallet', async () => {
    const signed = await EcdsaKoblitzSignature2016.sign({
      data: linkedData,
      domain: 'example.com',
      creator: wallet.data.keystore[kid].data.publicKey,
      privateKey: wallet.data.keystore[kid].data.privateKey,
    });
    const verified = await EcdsaKoblitzSignature2016.verify({
      data: signed,
      publicKey: wallet.data.keystore[kid].data.publicKey,
    });
    expect(signed.signature.domain).toBe('example.com');
    expect(verified).toBe(true);
  });

  it('can verify with resolver', async () => {
    const signed = await EcdsaKoblitzSignature2016.sign({
      data: linkedData,
      domain: 'example.com',
      creator: constructDIDPublicKeyID(did, kid),
      privateKey: wallet.data.keystore[kid].data.privateKey,
    });

    const verified = await DIDLinkedDataSignatureVerifier.verifyLinkedDataWithDIDResolver({
      data: signed,
      resolver: wallet.resolver,
      verify: EcdsaKoblitzSignature2016.verify,
    });

    expect(verified).toBe(true);
  });

  it('fails to verify when a key is revoked (removed from DID Document)', async () => {
    expect.assertions(1);
    const signed = await EcdsaKoblitzSignature2016.sign({
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
        verify: EcdsaKoblitzSignature2016.verify,
      });
    } catch (e) {
      expect(e.message).toBe(
        'Creator key is not present in resolved DID Document. Catch this error and consider the key revoked.',
      );
    }
  });
});
