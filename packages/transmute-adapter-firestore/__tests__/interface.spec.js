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

  it("bufferToContentID", async () => {
    const calc = await adapter.bufferToContentID(contentBuffer);
    expect(calc).toEqual(contentID);
  });

  it("writeJson", async () => {
    let calcCID = await adapter.writeJson(contentObject);
    expect(calcCID).toEqual(contentID);
  });

  it("readJson", async () => {
    let readJsonResult = await adapter.readJson(contentID);
    expect(readJsonResult).toEqual(contentObject);
  });
});
