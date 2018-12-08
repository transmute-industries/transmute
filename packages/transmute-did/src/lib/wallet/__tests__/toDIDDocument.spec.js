const fs = require('fs');
const path = require('path');
const { TransmuteDIDWallet, constructDIDPublicKeyID } = require('../index');

const fullWalletPath = path.resolve(__dirname, '__fixtures__/wallet.plaintext.full.json');

const openPGPKID = '2c4e730145b89cfebc1a0a16c64ccfa297277c2f136cfff8269b6bbfbaa3e178';
const libsodiumKID = 'c541a06014170f7e85383f13e95f2bf45da28473daa241fc2f21b16461efdec2';
const orbitDBKID = '5c51560bcef78d176b726a00b27ad3ef533ae39ef3d0f514392c79988c40d220';

const passphrase = 'yolo';
const did = 'did:test:0x123';

describe('toDIDDocument', () => {
  let wallet;

  beforeAll(async () => {
    wallet = new TransmuteDIDWallet(JSON.parse(fs.readFileSync(fullWalletPath).toString()));
  });

  describe('supports creating a did document', async () => {
    it('with a proof set', async () => {
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
    });

    it.only('with a proof chain', async () => {
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
      const didDocument = await wallet.toDIDDocument({
        did,
        proofChain,
        cacheLocal: true,
      });
      expect(didDocument.proof.length).toBe(3);
      expect(
        await wallet.verifySignedLinkedData({
          signedLinkedData: didDocument,
        }),
      ).toBe(true);
    });
  });
});
