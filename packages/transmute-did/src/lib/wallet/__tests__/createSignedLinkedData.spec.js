const fs = require('fs');

const { TransmuteDIDWallet, constructDIDPublicKeyID, schema } = require('../../../index');

const {
  fullWalletPath,
  proofChainPath,
  proofSetPath,
  openPGPKID,
  libsodiumKID,
  orbitDBKID,
  passphrase,
  did,
} = require('./__fixtures__/testParams');

const proofChain = [
  {
    kid: constructDIDPublicKeyID(did, openPGPKID),
    password: passphrase,
  },
  {
    kid: constructDIDPublicKeyID(did, libsodiumKID),
  },
  {
    kid: constructDIDPublicKeyID(did, orbitDBKID),
  },
];

const linkedData = {
  '@context': 'https://w3id.org/identity/v1',
  title: 'Hello World!',
};

describe('createSignedLinkedData', () => {
  let wallet;

  beforeAll(async () => {
    wallet = new TransmuteDIDWallet(JSON.parse(fs.readFileSync(fullWalletPath).toString()));
    // make sure the wallet has the did document in cache..
    await wallet.toDIDDocument({
      did,
      proofSet: proofChain,
      cacheLocal: true,
    });
  });

  // https://w3c-dvcg.github.io/ld-signatures/#introduction
  describe('supports creating ld-signatures', async () => {
    it('with a proof chain', async () => {
      const signedLinkedData = await wallet.createSignedLinkedData({
        data: linkedData,
        proofChain,
      });
      expect(signedLinkedData.data.proofChain.length).toBe(3);
      expect(
        await wallet.verifySignedLinkedData({
          signedLinkedData,
        }),
      ).toBe(true);
      expect(
        schema.validator.isValid(signedLinkedData, schema.schemas.didSignature),
      ).toBe(true);

      expect(signedLinkedData.schema).toBe(schema.schemas.didSignature.$id);
      // fs.writeFileSync(`${proofChainPath}`, JSON.stringify(signedLinkedData, null, 2));
    });

    it('with a proof set', async () => {
      const signedLinkedData = await wallet.createSignedLinkedData({
        data: linkedData,
        proofSet: proofChain,
      });
      expect(signedLinkedData.data.proof.length).toBe(3);
      expect(
        await wallet.verifySignedLinkedData({
          signedLinkedData,
        }),
      ).toBe(true);
      expect(
        schema.validator.isValid(signedLinkedData, schema.schemas.didSignature),
      ).toBe(true);
      expect(signedLinkedData.schema).toBe(schema.schemas.didSignature.$id);
      // leave for debugging
      // fs.writeFileSync(`${proofSetPath}`, JSON.stringify(signedLinkedData, null, 2));
    });
  });
});
