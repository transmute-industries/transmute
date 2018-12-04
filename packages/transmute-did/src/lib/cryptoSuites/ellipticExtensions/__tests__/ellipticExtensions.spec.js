const keypair = {
  publicKey:
    '041944abc14d1ed8bde949b0e0580b1e7bd72118afed6d174ab16d18be8f6f440a4b09193d1783afa1731f456f77313a14ea1ab48710e7b6a4776057fa71a08bf9',
  privateKey: 'e05d802f1cabfdcc3303f9390051de8ae130f87eb7e63fa0276b53d415a57139',
};

const data = 'hello';

const signature = '304402202dfa90d516f410823f4087fe2e1e003f35217e4539d52dea5e75ff4562d9b432022016e245b57194a6d6d500a373bd07b551f2b0c479a1c24cab0ddca4a2b5f3fb60';

const EC = require('elliptic').ec;

const ec = new EC('secp256k1');

const { createKeypair, sign, verify } = require('../index');

describe('ellipticExtensions', () => {
  describe('sanity', () => {
    it('from scratch', () => {
      const key = ec.genKeyPair();
      const sig = ec.sign(data, key).toDER('hex');
      const res = ec.verify(data, sig, key);
      expect(res).toBe(true);
    });

    it('from hex encoded keypair', () => {
      const key = ec.keyPair({
        pub: keypair.publicKey,
        priv: keypair.privateKey,
        privEnc: 'hex',
        pubEnc: 'hex',
      });
      const sig = ec.sign(data, key).toDER('hex');
      const res = ec.verify(data, sig, key);
      expect(res).toBe(true);
    });
  });

  it('createKeypair', async () => {
    const keypair2 = await createKeypair();
    expect(keypair2.publicKey).toBeDefined();
    expect(keypair2.privateKey).toBeDefined();
  });

  it('sign', async () => {
    const signature2 = await sign(data, keypair.privateKey);
    expect(signature2).toBeDefined();
  });

  it('verify', async () => {
    const verified = await verify(data, signature, keypair.publicKey);
    expect(verified).toBe(true);
  });
});
