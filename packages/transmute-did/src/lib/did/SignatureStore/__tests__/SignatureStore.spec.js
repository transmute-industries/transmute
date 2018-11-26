const fs = require('fs');
const path = require('path');

const TransmuteAdapterMemory = require('@transmute/transmute-adapter-memory');

const adapter = new TransmuteAdapterMemory();

const { verifyDIDSignature, constructDIDPublicKeyID } = require('../../index');

const SignatureStore = require('../index');

const { TransmuteDIDWallet } = require('../../../wallet');

const fullWalletPath = path.resolve(
  __dirname,
  '../../../wallet/__tests__/__fixtures__/wallet.plaintext.full.json',
);

const walletEllipticSignaturePath = path.resolve(
  __dirname,
  '../../../wallet/__tests__/__fixtures__/wallet.did.orbitdb.signature.json',
);

const walletOpenPGPSignaturePath = path.resolve(
  __dirname,
  '../../../wallet/__tests__/__fixtures__/wallet.did.openpgp.signature.json',
);

const walletLibSodiumSignaturePath = path.resolve(
  __dirname,
  '../../../wallet/__tests__/__fixtures__/wallet.did.sodium.signature.json',
);

const wallet = new TransmuteDIDWallet(JSON.parse(fs.readFileSync(fullWalletPath).toString()));
const openPGPKID = '2c4e730145b89cfebc1a0a16c64ccfa297277c2f136cfff8269b6bbfbaa3e178';
const passhprase = 'yolo';
describe('SignatureStore', () => {
  let doc;
  let meta;
  let signature;
  let resolver;
  let signatureStore;

  beforeAll(async () => {
    const result = await wallet.toDIDDocument(openPGPKID, passhprase);
    //   eslint-disable-next-line
    doc = result.object;
    //   eslint-disable-next-line
    signature = result.signature;

    //   eslint-disable-next-line
    meta = result.meta;
    resolver = {
      //   eslint-disable-next-line
      resolve: did => Promise.resolve(doc),
    };

    signatureStore = new SignatureStore(adapter, resolver, verifyDIDSignature);
  });

  it('supports saving openpgp signed did documents', async () => {
    const kid = constructDIDPublicKeyID(doc.id, openPGPKID);
    const storeObject = {
      object: doc,
      signature,
      meta: {
        ...meta,
        did: doc.id,
        publicKey: kid,
        notes: 'DID Document signature',
      },
    };
    const { signatureID } = await signatureStore.add(storeObject);

    const storeObject2 = await signatureStore.getBySignatureID(signatureID);
    expect(storeObject2.object).toEqual(doc);
  });

  it('supports verifying an elliptic signature', async () => {
    //   eslint-disable-next-line
    const { object, signature, meta } = JSON.parse(
      fs.readFileSync(walletEllipticSignaturePath).toString(),
    );
    const verified = await signatureStore.verify(object, signature, meta);
    expect(verified).toBe(true);
  });

  it('supports verifying an openpgp signature', async () => {
    //   eslint-disable-next-line
    const { object, signature, meta } = JSON.parse(
      fs.readFileSync(walletOpenPGPSignaturePath).toString(),
    );
    const verified = await signatureStore.verify(object, signature, meta);
    expect(verified).toBe(true);
  });

  it('supports verifying an libsodium signature', async () => {
    //   eslint-disable-next-line
    const { object, signature, meta } = JSON.parse(
      fs.readFileSync(walletLibSodiumSignaturePath).toString(),
    );
    const verified = await signatureStore.verify(object, signature, meta);
    expect(verified).toBe(true);
  });
});
