const TransmuteAdaperMemory = require("../index");

const adapter = new TransmuteAdaperMemory();

const contentID =
  "0x07944c2cf8591b40bce4bc010e2d8906cc31e8d8fbf8e7a352b458020cc9439f";
const content = { hello: "world" };

describe("TransmuteAdaperMemory", () => {
  it("bufferToContentID", async () => {
    const content = Buffer.from("hello");
    const contentID = await adapter.bufferToContentID(content);
    expect(contentID).toBe(
      "0x7bb129136cd5c391f6a2401e5cb7317575dcf79352249536bea3a937aef9bd9c"
    );
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
});
