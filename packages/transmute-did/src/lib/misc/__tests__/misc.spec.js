const misc = require("../index");

const key = "606be053abf0ca332dd76cb76fc8dee21e0874e0a55877d1c0e91382b286ee4c";

const shares = [
  "80157b05ca9edcc16c089ebb36c5ab9b63a84f495e716b23e04ff993ab0813fdfcb6743ab939ce638a6a2e82fd35c33caf8",
  "802b468204d5795c89c8f4d84917a768971dfbd9e09278ab0254a03879f3cb54019f1a96a7cc6f51828253f8b92b5abf664",
  "803e3d87ce4ba59de5c06a637fd20cf3f4a3b22ebbd9ac84412984dd198d242413088e2b50fff4b575f473eb7c35b1ed2d0",
  "8041d841a92d4773a2139b8ce06eb88c8f9b629765b25db38e2bc5fa67fbb30b597a98b863027084a62932f995083a98375",
  "8054a34463b39bb2ce1b0537d6ab1317ec252b603ef9899ccd56e11f07855c7b4bed0c059431eb60515f12ea5016d1ca7c1"
];

describe("misc", () => {
  describe("shatterKey", () => {
    it("should breakup a key in shares", async () => {
      expect.assertions(1);
      const shares = await misc.shatterKey({
        key,
        shareNumber: 5,
        shareThreshold: 3
      });
      expect(shares.length).toBe(5);
    });
  });

  describe("recoverKey", () => {
    it("should recover a key from shares", async () => {
      expect.assertions(1);
      const recoveredKey = await misc.recoverKey({
        shares: shares.splice(0, 3)
      });
      expect(recoveredKey).toBe(key);
    });
  });
});
