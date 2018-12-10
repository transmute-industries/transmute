const fs = require('fs');

const { TransmuteDIDWallet, constructDIDPublicKeyID, schema } = require('../../../index');

const {
  fullWalletPath,
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

describe('generateDIDRevocationCertificate', () => {
  let wallet;
  let didDocument;

  beforeAll(async () => {
    wallet = new TransmuteDIDWallet(JSON.parse(fs.readFileSync(fullWalletPath).toString()));
    const result = await wallet.toDIDDocument({
      did,
      proofSet,
      cacheLocal: true,
    });
    didDocument = result.data;

    expect(schema.validator.isValid(wallet.data, schema.schemas.didWalletPlaintext)).toBe(true);
  });

  it('Can revoke a full did', async () => {
    const result = await wallet.generateDIDRevocationCertificate({
      did: didDocument.id,
      proofSet,
    });
    expect(schema.validator.isValid(result.data, schema.schemas.didRevocationCertSchema)).toBe(
      true,
    );
    expect(result.schema).toBe(schema.schemas.didRevocationCertSchema.$id);
  });

  it('Can revoke a kid in a did', async () => {
    const result = await wallet.generateDIDRevocationCertificate({
      did: constructDIDPublicKeyID(did, openPGPKID),
      proofSet,
    });
    expect(result.data.proof).toBeDefined();
    expect(schema.validator.isValid(result.data, schema.schemas.didRevocationCertSchema)).toBe(
      true,
    );
    expect(result.schema).toBe(schema.schemas.didRevocationCertSchema.$id);
  });
});
