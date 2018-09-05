const TransmuteAdapterFirestore = require("../index");

const admin = require("firebase-admin");

const serviceAccount = require("../serviceAccount");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const adapter = new TransmuteAdapterFirestore(db, "events");

const contentID =
  "0xcb2402ae09412ffb174e20aa741a7ec0b82338a9a471b4f848e2c9684fcd6a21";

const contentObject = {
  first: "Ada",
  born: 1999,
  last: "Lovelace"
};

const contentBuffer = Buffer.from(JSON.stringify(contentObject));

describe("Transmute Adapter Firestore", () => {
  it("has a contructor", () => {
    expect(adapter).toBeDefined();
  });

  describe("bufferToContentID", () => {
    it("converts a buffer to a bytes32 compatable IPFS hash of the buffer", async () => {
      const calc = await adapter.bufferToContentID(contentBuffer);
      expect(calc).toEqual(contentID);
    });
  });

  describe("writeJson", () => {
    it("stores the object and returns a content identifier the object", async () => {
      let calcCID = await adapter.writeJson(contentObject);
      expect(calcCID).toEqual(contentID);
    });
  });

  describe("readJson", () => {
    it("returns a json object for the given content identifier", async () => {
      let readJsonResult = await adapter.readJson(contentID);
      expect(readJsonResult).toEqual(contentObject);
    });
  });
});
