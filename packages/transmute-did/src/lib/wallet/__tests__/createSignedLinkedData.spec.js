const fs = require('fs');
const path = require('path');
const { TransmuteDIDWallet, constructDIDPublicKeyID } = require('../index');

const fullWalletPath = path.resolve(__dirname, '__fixtures__/wallet.plaintext.full.json');

const openPGPKID = '2c4e730145b89cfebc1a0a16c64ccfa297277c2f136cfff8269b6bbfbaa3e178';
const libsodiumKID = 'c541a06014170f7e85383f13e95f2bf45da28473daa241fc2f21b16461efdec2';
const orbitDBKID = '5c51560bcef78d176b726a00b27ad3ef533ae39ef3d0f514392c79988c40d220';

const passphrase = 'yolo';
const did = 'did:test:0x123';

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
      expect(signedLinkedData.proofChain.length).toBe(3);
      expect(
        await wallet.verifySignedLinkedData({
          signedLinkedData,
        }),
      ).toBe(true);
    });

    it('with a proof set', async () => {
      const signedLinkedData = await wallet.createSignedLinkedData({
        data: linkedData,
        proofSet: proofChain,
      });
      expect(signedLinkedData.proof.length).toBe(3);
      expect(
        await wallet.verifySignedLinkedData({
          signedLinkedData,
        }),
      ).toBe(true);
    });
  });
});
