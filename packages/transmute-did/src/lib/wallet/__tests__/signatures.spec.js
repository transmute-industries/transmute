const fs = require('fs');
const path = require('path');
const didWallet = require('../index');

const fullWalletPath = path.resolve(__dirname, '__fixtures__/wallet.plaintext.full.json');

const openPGPKID = '2c4e730145b89cfebc1a0a16c64ccfa297277c2f136cfff8269b6bbfbaa3e178';
const passphrase = 'yolo';

const linkedData = {
  '@context': 'https://w3id.org/identity/v1',
  title: 'Hello World!',
};

const did = '0x123';

describe('signatures', () => {
  let wallet;

  beforeAll(async () => {
    wallet = new didWallet.TransmuteDIDWallet(
      JSON.parse(fs.readFileSync(fullWalletPath).toString()),
    );
    await wallet.toDIDDocument({
      did,
      kid: openPGPKID,
      password: passphrase,
      cacheLocal: true,
    });
  });

  describe('create and verify linked data signatures produced by wallet', () => {
    it('is included by default', async () => {
      const signedLinkedData = await wallet.createSignedLinkedData({
        data: linkedData,
        did,
        kid: openPGPKID,
        password: passphrase,
      });
      const isVerified = await wallet.verifySignedLinkedData({
        signedLinkedData,
      });
      expect(isVerified).toBe(true);
    });
  });
});
