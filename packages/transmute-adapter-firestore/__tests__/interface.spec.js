const stringify = require('json-stringify-deterministic');

const TransmuteAdapterFirestore = require("../index");

// When using this adapter from a protected web server...
// const admin = require("firebase-admin");
// const serviceAccount = require("../service-account-firebase-adminsdk.json")
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
// const db = admin.firestore();

let db = {};
const adapter = new TransmuteAdapterFirestore(db, "events");

const contentID =
  "0x6eca7ce8578c4adda340adf6b40fa59e4283ef9ff432c4e417e55bb53436bb38";

const contentObject = {
  first: "Ada",
  born: 1999,
  last: "Lovelace"
};

const contentBuffer = Buffer.from(stringify(contentObject));

adapter.readJson = jest.fn().mockImplementation(contentID => contentObject);
adapter.writeJson = jest.fn().mockImplementation(contentObject => contentID);

describe("Transmute Adapter Firestore", () => {
  it("has a contructor", () => {
    expect(adapter).toBeDefined();
  });

  describe("bufferToContentID", () => {
    it("converts a buffer to a bytes32 compatible IPFS hash of the buffer", async () => {
      expect.assertions(1);
      const calc = await adapter.bufferToContentID(contentBuffer);
      expect(calc).toBe(contentID);
    });
  });

  describe("writeJson", () => {
    it("stores the object and returns a content identifier the object", async () => {
      expect.assertions(1);
      let calcCID = await adapter.writeJson(contentObject);
      expect(calcCID).toBe(contentID);
    });
  });

  describe("readJson", () => {
    it("returns a json object for the given content identifier", async () => {
      expect.assertions(1);
      let readJsonResult = await adapter.readJson(contentID);
      expect(readJsonResult).toEqual(contentObject);
    });
  });
});
