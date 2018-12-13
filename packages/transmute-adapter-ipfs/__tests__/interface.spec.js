const stringify = require('json-stringify-deterministic');

const TransmuteAdapterIPFS = require("../index");
const ipfsConfig = require("../ipfsConfig");

const adapter = new TransmuteAdapterIPFS(ipfsConfig);

const contentID =
  "0x6eca7ce8578c4adda340adf6b40fa59e4283ef9ff432c4e417e55bb53436bb38";

const contentObject = {
  first: "Ada",
  born: 1999,
  last: "Lovelace"
};

const contentBuffer = Buffer.from(stringify(contentObject));

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
      expect.assertions(1);
      let cid = await adapter.bufferToContentID(contentBuffer);
      expect(cid).toBe(contentID);
    });

    it("matches the output of _writeBuffer", async () => {
      expect.assertions(2);
      let cid = await adapter.bufferToContentID(contentBuffer);
      let writeBufferResult = await adapter._writeBuffer(contentBuffer);
      expect(cid).toBe(contentID);
      expect(writeBufferResult).toBe(contentID);
    });
  });

  describe("_writeBuffer", () => {
    it("stores a buffer and returns its identifier", async () => {
      expect.assertions(1);
      let writeBufferResult = await adapter._writeBuffer(contentBuffer);
      expect(writeBufferResult).toBe(contentID);
    });
  });

  describe("_readBuffer", () => {
    it("retrieves a buffer from its identifier", async () => {
      expect.assertions(1);
      let readBufferResult = await adapter._readBuffer(contentID);
      expect(readBufferResult).toEqual(contentBuffer);
    });
  });

  describe("writeJson", () => {
    it("stores a json object and returns its identifier", async () => {
      expect.assertions(1);
      let writeJsonResult = await adapter.writeJson(contentObject);
      expect(writeJsonResult).toBe(contentID);
    });
  });

  describe("readJson", () => {
    it("retrieves a json object from its identifier", async () => {
      expect.assertions(1);
      let readJsonResult = await adapter.readJson(contentID);
      expect(readJsonResult).toEqual(contentObject);
    });
  });
});
