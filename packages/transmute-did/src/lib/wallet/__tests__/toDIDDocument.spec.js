const fs = require('fs');

const tmp = require('tmp');
const { TransmuteDIDWallet, constructDIDPublicKeyID } = require('../index');

const {
  fullWalletPath,
  didDocumentPath,
  openPGPKID,
  libsodiumKID,
  orbitDBKID,
  passphrase,
  did,
} = require('./__fixtures__/testParams');

const proofSet = [
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

const openpgpDIDDocPath = tmp.fileSync().name;

describe('toDIDDocument', () => {
  let wallet;

  beforeAll(async () => {
    wallet = new TransmuteDIDWallet(JSON.parse(fs.readFileSync(fullWalletPath).toString()));
  });

  it('throws an error when kid does not reference a did', async () => {
    expect.assertions(1);
    try {
      await wallet.toDIDDocument({ did, proofSet: [{ kid: openPGPKID }] });
    } catch (e) {
      expect(e.message).toEqual('kid must be of the format: did#kid=...');
    }
  });

  it('throws an error when exporting a did document for an openpgp keypair, and no password', async () => {
    expect.assertions(1);
    try {
      await wallet.toDIDDocument({
        did,
        proofSet: [{ kid: constructDIDPublicKeyID(did, openPGPKID) }],
      });
    } catch (e) {
      expect(e.message).toEqual('Incorrect key passphrase');
    }
  });

  it('supports exporting a did document for an openpgp keypair', async () => {
    const doc = await wallet.toDIDDocument({
      did,
      proofSet: [{ kid: constructDIDPublicKeyID(did, openPGPKID), password: passphrase }],
    });
    expect(doc).toBeDefined();

    fs.writeFileSync(openpgpDIDDocPath, JSON.stringify(doc, null, 2));
  });

  describe('supports creating a did document', async () => {
    it('with a proof set', async () => {
      const didDocument = await wallet.toDIDDocument({
        did,
        proofSet,
        cacheLocal: true,
      });
      expect(didDocument.proof.length).toBe(3);
      expect(
        await wallet.verifySignedLinkedData({
          signedLinkedData: didDocument,
        }),
      ).toBe(true);

      fs.writeFileSync(`${didDocumentPath}`, JSON.stringify(didDocument, null, 2));
    });
  });
});
