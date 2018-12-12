const stringify = require('json-stringify-deterministic');

const TransmuteAdapterFirebaseRTDB = require('../index');

// When using this adapter from a protected web server...
// const admin = require('firebase-admin');
// const serviceAccount = require('../service-account-firebase-adminsdk.json')
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
// const db = admin.database();

const db = {};
const adapter = new TransmuteAdapterFirebaseRTDB(db, 'test_path');

const contentID = '0x6eca7ce8578c4adda340adf6b40fa59e4283ef9ff432c4e417e55bb53436bb38';

const contentObject = {
  first: 'Ada',
  born: 1999,
  last: 'Lovelace',
};

const contentBuffer = Buffer.from(stringify(contentObject));

adapter.readJson = jest.fn().mockImplementation(() => contentObject);
adapter.writeJson = jest.fn().mockImplementation(() => contentID);

describe('Transmute Adapter Firebase Real Time Database', () => {
  it('has a contructor', () => {
    expect(adapter).toBeDefined();
  });

  describe('bufferToContentID', () => {
    it('converts a buffer to a bytes32 compatible IPFS hash of the buffer', async () => {
      expect.assertions(1);
      const calc = await adapter.bufferToContentID(contentBuffer);
      expect(calc).toBe(contentID);
    });
  });
});
