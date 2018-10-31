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

const contentID = '0xcb2402ae09412ffb174e20aa741a7ec0b82338a9a471b4f848e2c9684fcd6a21';

const contentObject = {
  first: 'Ada',
  born: 1999,
  last: 'Lovelace',
};

const contentBuffer = Buffer.from(JSON.stringify(contentObject));

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
