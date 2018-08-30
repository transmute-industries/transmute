const TransmuteAdapterIPFS = require("../index");

const localIPFSConfig = {
  host: "localhost",
  port: 5001,
  protocol: "http"
};

const adapter = new TransmuteAdapterIPFS(localIPFSConfig);

const contentID =
  "0xcb2402ae09412ffb174e20aa741a7ec0b82338a9a471b4f848e2c9684fcd6a21";

const contentObject = {
  first: "Ada",
  born: 1999,
  last: "Lovelace"
};

const contentBuffer = Buffer.from(JSON.stringify(contentObject));

describe("Transmute Adapter IPFS", () => {
  it("has a contructor", () => {
    expect(adapter).toBeDefined();
  });

  it("has method healthy", async () => {
    let adapterHealth = await adapter.healthy();
    expect(adapterHealth).toBeDefined();
  });

  describe("bufferToContentID", () => {
    it("convertes a buffer to a content identifier", async () => {
      let cid = await adapter.bufferToContentID(contentBuffer);
      expect(cid).toEqual(contentID);
    });

    it("matches the output of write buffer", async () => {
      let cid = await adapter.bufferToContentID(contentBuffer);
      let writeBufferResult = await adapter.writeBuffer(contentBuffer);
      expect(cid).toEqual(contentID);
      expect(writeBufferResult).toEqual(contentID);
    });
  });

  describe("writeBuffer", () => {
    it("stores a buffer and returns its identifier", async () => {
      let writeBufferResult = await adapter.writeBuffer(contentBuffer);
      expect(writeBufferResult).toEqual(contentID);
    });
  });

  describe("readBuffer", () => {
    it("retrieves a buffer from its identifier", async () => {
      let readBufferResult = await adapter.readBuffer(contentID);
      expect(readBufferResult).toEqual(contentBuffer);
    });
  });

  describe("writeJson", () => {
    it("stores a json object and returns its identifier", async () => {
      let writeJsonResult = await adapter.writeJson(contentObject);
      expect(writeJsonResult).toEqual(contentID);
    });
  });

  describe("readJson", () => {
    it("retrieves a json object from its identifier", async () => {
      let readJsonResult = await adapter.readJson(contentID);
      expect(readJsonResult).toEqual(contentObject);
    });
  });
});
