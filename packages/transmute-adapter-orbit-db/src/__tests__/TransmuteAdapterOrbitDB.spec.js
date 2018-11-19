const {
  TransmuteAdapterOrbitDB,
  ipfsOptions,
  getReadyIPFS,
  getOrbitDBFromKeypair
} = require("../index");

const keypair = {
  publicKey:
    "04a5e814736e5ad0cf56456026aec330afe8ba949096a28eefafbb66493b4e7a965ac2476baaae1e4a3c714d59336ede41b44b2281f36ce4190649ab47af678adc",
  privateKey: "72e9cea8fff6afc1b87b1bd710374edbf6dff7518ba82754138b5fbb99f6c6ab"
};

const content = { hello: "world" };
const contentBuffer = Buffer.from(JSON.stringify(content));
const contentID =
  "0x07944c2cf8591b40bce4bc010e2d8906cc31e8d8fbf8e7a352b458020cc9439f";

describe("TransmuteAdapterOrbitDB", () => {
  let ipfs;
  let orbitdb;
  let adapter;
  let address;
  beforeAll(async () => {
    ipfs = await getReadyIPFS(ipfsOptions);
    ipfs.on("error", error => {
      expect(error.code).toBe("ERR_DB_DELETE_FAILED");
    });
    orbitdb = await getOrbitDBFromKeypair(ipfs, keypair);
    adapter = new TransmuteAdapterOrbitDB(orbitdb);
  });

  it("has a constuctor", async () => {
    expect(adapter).toBeDefined();
  });

  it("can open an orbit db by name", async () => {
    await adapter.open("hello");
    expect(adapter.db).toBeDefined();
    address = adapter.db.address.toString();
  });

  it("can open an orbit db by address", async () => {
    await adapter.open(address);
    expect(adapter.db).toBeDefined();
  });

  it("can bufferToContentID", async () => {
    const contentID = await adapter.bufferToContentID(contentBuffer);
    expect(contentID).toBe(contentID);
  });

  it("writeJson", async () => {
    const contentID = await adapter.writeJson(content);
    expect(contentID).toBe(
      "0x07944c2cf8591b40bce4bc010e2d8906cc31e8d8fbf8e7a352b458020cc9439f"
    );
  });

  it("readJson", async () => {
    const content2 = await adapter.readJson(contentID);
    expect(content2).toEqual(content);
  });

  afterAll(async () => {
    await ipfs.stop();
  });
});
