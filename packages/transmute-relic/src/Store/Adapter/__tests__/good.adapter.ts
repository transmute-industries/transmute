
const bs58 = require("bs58");
import { Adapter } from "../index";

/**
 * Good Adapter tests
 */
describe("Good adapter tests", () => {
  it("supports ipfs ", async () => {
    let ipfsAdapter = require("../../../../../transmute-adapter-ipfs");
    let ipfs = ipfsAdapter.getStorage();

    let storeTypeAdapter = new Adapter(
      {
        I: {
          keyName: "multihash",
          adapter: ipfsAdapter,
          db: ipfs
        }
      },
      {
        I: {
          readIDFromBytes32: (bytes32: string) => {
            return bs58.encode(new Buffer("1220" + bytes32.slice(2), "hex"));
          },
          writeIDToBytes32: (id: string) => {
            return "0x" + new Buffer(bs58.decode(id).slice(2)).toString("hex");
          }
        }
      }
    );
    let payload = {
      multihash: "QmcEMXuJYiyDQpbU1BaFQngaBajPEs9UUHuQnPUYSLWa1B"
    };
    let encodedId = storeTypeAdapter.converter["I"].writeIDToBytes32(payload.multihash);
    let decodedId = storeTypeAdapter.converter["I"].readIDFromBytes32(encodedId);
    expect(payload.multihash).toBe(decodedId);
  });
});
