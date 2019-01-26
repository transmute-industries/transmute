const OpenPgpSignature2019 = require('@transmute/openpgpsignature2019');

const openpgp = require('@transmute/openpgpsignature2019/node_modules/openpgp');

const fixtures = require('./__fixtures__');
const {
  createWallet,
  constructDIDPublicKeyID,
  DIDLinkedDataSignatureVerifier,
} = require('../../../index');

jest.setTimeout(10000);

describe('OpenPgpSignature2019', () => {
  let wallet;
  let kid;
  const did = 'did:example:123';
  let didDocument;
  it('can create a wallet with RSA keys', async () => {
    wallet = await createWallet();

    const keypair = await openpgp.generateKey({
      userIds: [
        {
          name: fixtures.email,
        },
      ],
      curve: 'secp256k1',
      passphrase: fixtures.passphrase,
    });

    await wallet.addKey(
      {
        publicKey: keypair.publicKeyArmored,
        privateKey: keypair.privateKeyArmored,
      },
      'assymetric',
      {
        tags: ['OpenPgpSignature2019', 'PROPOSAL'],
        notes: 'created for testing purposes',
        did: {
          primaryKeyOf: did,
          publicKey: true,
          authentication: true,
          publicKeyType: 'publicKeyPem',
          signatureType: 'OpenPgpSignature2019',
        },
      },
    );
    // eslint-disable-next-line
    kid = Object.keys(wallet.data.keystore)[0];
    const firstKeystore = wallet.data.keystore[kid];
    expect(firstKeystore.data.publicKey).toBe(keypair.publicKeyArmored);
  });
  it('can create a DID Document', async () => {
    const result = await wallet.toDIDDocument({
      did,
      cacheLocal: true,
    });
    didDocument = result.data;
    expect(didDocument.publicKey[0].type).toBe('OpenPgpSignature2019');
  });

  it('can sign and verify with wallet', async () => {
    const privateKey = (await openpgp.key.readArmored(wallet.data.keystore[kid].data.privateKey))
      .keys[0];
    await privateKey.decrypt(fixtures.passphrase);

    const signed = await OpenPgpSignature2019.sign({
      data: fixtures.linkedData,
      domain: 'example.com',
      creator: constructDIDPublicKeyID(did, kid),
      privateKey,
    });
    const verified = await OpenPgpSignature2019.verify({
      data: signed,
      publicKey: wallet.data.keystore[kid].data.publicKey,
    });
    expect(signed.signature.domain).toBe('example.com');
    expect(verified).toBe(true);
  });

  it('can verify with resolver', async () => {
    const privateKey = (await openpgp.key.readArmored(wallet.data.keystore[kid].data.privateKey))
      .keys[0];
    await privateKey.decrypt(fixtures.passphrase);

    const signed = await OpenPgpSignature2019.sign({
      data: fixtures.linkedData,
      domain: 'example.com',
      creator: constructDIDPublicKeyID(did, kid),
      privateKey,
    });

    const verified = await DIDLinkedDataSignatureVerifier.verifyLinkedDataWithDIDResolver({
      data: signed,
      resolver: wallet.resolver,
      verify: OpenPgpSignature2019.verify,
    });

    expect(verified).toBe(true);
  });

  it('fails to verify when a key is revoked (removed from DID Document)', async () => {
    expect.assertions(1);
    const privateKey = (await openpgp.key.readArmored(wallet.data.keystore[kid].data.privateKey))
      .keys[0];
    await privateKey.decrypt(fixtures.passphrase);

    const signed = await OpenPgpSignature2019.sign({
      data: fixtures.linkedData,
      domain: 'example.com',
      creator: constructDIDPublicKeyID(did, kid),
      privateKey,
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
        verify: OpenPgpSignature2019.verify,
      });
    } catch (e) {
      expect(e.message).toBe(
        'No primary key was found',
      );
    }
  });
});
