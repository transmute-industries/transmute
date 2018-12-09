const TransmuteAdapterMemory = require('@transmute/transmute-adapter-memory');

const adapter = new TransmuteAdapterMemory();

const SignatureStore = require('../SignatureStore');

const { constructDIDPublicKeyID } = require('../signatureMethods');

const { TransmuteDIDWallet } = require('../wallet');

const {
  fullWallet,
  openPGPKID,
  libsodiumKID,
  orbitDBKID,
  passphrase,
  did,
} = require('../wallet/__tests__/__fixtures__/testParams');

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

describe('SignatureStore', () => {
  let wallet;
  let didDocument;
  let signatureStore;

  beforeAll(async () => {
    wallet = new TransmuteDIDWallet(fullWallet);
    didDocument = await wallet.toDIDDocument({
      did,
      proofSet,
      cacheLocal: true,
    });
    signatureStore = new SignatureStore(adapter, wallet.resolver);
  });

  it('supports ld-signatures', async () => {
    const data = await wallet.createSignedLinkedData({
      data: {
        subject: didDocument.id,
        claims: ['isInvestor', 'hasDriversLicense'],
      },
      proofSet,
    });
    const { contentID } = await signatureStore.add(data);
    const { verified, signedLinkedData } = await signatureStore.getSignedLinkedDataByContentID(
      contentID,
    );
    expect(signedLinkedData.subject).toEqual(didDocument.id);
    expect(verified).toBe(true);
  });

  it('returns with verified false when signature verication fails', async () => {
    const data = await wallet.createSignedLinkedData({
      data: {
        subject: didDocument.id,
        claims: ['isInvestor', 'hasDriversLicense'],
      },
      proofSet,
    });
    data.breakingChange = true;
    const { contentID } = await signatureStore.add(data);
    const { verified, signedLinkedData } = await signatureStore.getSignedLinkedDataByContentID(
      contentID,
    );
    expect(signedLinkedData.subject).toEqual(didDocument.id);
    expect(verified).toBe(false);
  });
});
