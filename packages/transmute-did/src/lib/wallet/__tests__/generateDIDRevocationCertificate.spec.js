const fs = require('fs');

const { TransmuteDIDWallet, constructDIDPublicKeyID } = require('../index');

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
    didDocument = await wallet.toDIDDocument({
      did,
      proofSet,
      cacheLocal: true,
    });
  });

  it('Can revoke a full did', async () => {
    const revocationCert = await wallet.generateDIDRevocationCertificate({
      did: didDocument.id,
      proofSet,
    });
    expect(revocationCert.proof).toBeDefined();
  });

  it('Can revoke a kid in a did', async () => {
    const revocationCert = await wallet.generateDIDRevocationCertificate({
      did: constructDIDPublicKeyID(did, openPGPKID),
      proofSet,
    });
    expect(revocationCert.proof).toBeDefined();
  });
});
