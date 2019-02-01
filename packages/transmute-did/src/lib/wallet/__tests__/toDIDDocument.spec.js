const fs = require('fs');
const tmp = require('tmp');
const stringify = require('json-stringify-deterministic');

const { TransmuteDIDWallet, constructDIDPublicKeyID, schema } = require('../../../index');

const {
  fullWalletPath,
  ethereumKID,
  openPGPKID,
  libsodiumKID,
  orbitDBKID,
  passphrase,
  did,
  did2,
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
    const kids = doc.data.publicKey
      .map(key => key.id.split('kid=')[1]);
    expect(kids).toContain(openPGPKID);

    fs.writeFileSync(openpgpDIDDocPath, stringify(doc, null, 2));
  });

  describe('supports creating a valid did document', async () => {
    it('with a proof set', async () => {
      const result = await wallet.toDIDDocument({
        did,
        proofSet,
        cacheLocal: true,
      });

      expect(result.data.proof.length).toBe(3);
      const { verified } = await wallet.verifySignedLinkedData({
        signedLinkedData: result.data,
      });
      expect(verified).toBe(true);

      expect(schema.validator.isValid(result.data, schema.schemas.didDocument)).toBe(true);
      expect(result.schema).toBe(schema.schemas.didDocument.$id);
      // leave for debugging
      // fs.writeFileSync(`${didDocumentPath}`, stringify(result.data, null, 2));
    });
  });

  it('supports exporting a did document for an ethereum keypair', async () => {
    const doc = await wallet.toDIDDocument({
      did,
      proofSet: [{ kid: constructDIDPublicKeyID(did, ethereumKID), password: passphrase }],
    });
    expect(doc).toBeDefined();
    const kids = doc.data.publicKey
      .map(key => key.id.split('kid=')[1]);
    expect(kids).toContain(ethereumKID);
  });
});

describe('toDIDDocumentByTag', () => {
  let wallet;

  beforeAll(async () => {
    wallet = new TransmuteDIDWallet(JSON.parse(fs.readFileSync(fullWalletPath).toString()));
  });

  it('supports exporting a did document by chosing the keys by tag', async () => {
    const doc = await wallet.toDIDDocumentByTag({
      did: did2,
      tag: 'wallet1',
    });
    expect(doc).toBeDefined();
    const kids = doc.data.publicKey
      .map(key => key.id.split('kid=')[1]);
    expect(kids).toContain(ethereumKID);
    expect(kids).toContain(orbitDBKID);
    // This one does not have the 'wallet1' tag
    expect(kids).not.toContain('4c22585330c9150c3e61ffc668963ec0e841c14396e638561312bc518c371b6a');
  });

  it('supports exporting a different did document by chosing the keys by tag from the same wallet', async () => {
    const doc = await wallet.toDIDDocumentByTag({
      did,
      tag: 'wallet2',
    });
    expect(doc).toBeDefined();
    const kids = doc.data.publicKey
      .map(key => key.id.split('kid=')[1]);
    expect(kids).toContain(openPGPKID);
    expect(kids).toContain(libsodiumKID);
    expect(kids).toHaveLength(2);
  });
});
