const fs = require('fs');
const path = require('path');
const didWallet = require('../index');

const fullWalletPath = path.resolve(__dirname, '__fixtures__/wallet.plaintext.full.json');

const openpgpDIDDocPath = path.resolve(__dirname, '__fixtures__/openpgp.did.document.json');

describe('did-wallet', () => {
  describe('toDIDDocument', () => {
    it('supports exporting a did document for an openpgp keypair', async () => {
      const wallet = new didWallet.TransmuteDIDWallet(
        JSON.parse(fs.readFileSync(fullWalletPath).toString()),
      );

      const openPGPKID = '2c4e730145b89cfebc1a0a16c64ccfa297277c2f136cfff8269b6bbfbaa3e178';
      const passhprase = 'yolo';
      const { doc, signature } = await wallet.toDIDDocument(openPGPKID, passhprase);

      // todo: call validation on document....
      expect(doc).toBeDefined();
      // todo: verify document signature
      expect(signature).toBeDefined();

      fs.writeFileSync(openpgpDIDDocPath, JSON.stringify(doc, null, 2));
      fs.writeFileSync(`${openpgpDIDDocPath}.signature`, signature);
    });
  });
});
