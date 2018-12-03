const tmp = require('tmp');
const fs = require('fs');
const path = require('path');
const didWallet = require('../index');

const fullWalletPath = path.resolve(__dirname, '__fixtures__/wallet.plaintext.full.json');

const openPGPKID = '2c4e730145b89cfebc1a0a16c64ccfa297277c2f136cfff8269b6bbfbaa3e178';
const passphrase = 'yolo';

const didRevocationCertificatePath = tmp.fileSync().name;

describe('did-wallet', () => {
  let wallet;
  let doc;
  let signature;

  beforeAll(async () => {
    wallet = new didWallet.TransmuteDIDWallet(
      JSON.parse(fs.readFileSync(fullWalletPath).toString()),
    );
    const result = await wallet.toDIDDocument(openPGPKID, passphrase);
    //   eslint-disable-next-line
    doc = result.object;
    //   eslint-disable-next-line
    signature = result.signature;
    //   eslint-disable-next-line
    meta = result.meta;
  });

  describe('generateDIDRevocationCertificate', () => {
    it('supports revocation of an openpgp based did', async () => {
      const cert = await wallet.generateDIDRevocationCertificate({
        asDIDByKID: openPGPKID,
        asDIDByKIDPassphrase: passphrase,
      });
      fs.writeFileSync(didRevocationCertificatePath, JSON.stringify(cert, null, 2));
    });
  });
});
