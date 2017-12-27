const bs58 = require("bs58");
import { StoreAdapter } from "../index";

/**
 * Bad adapter tests
 */
describe("Bad adapter tests", () => {
  it("throws errors when passed TransmuteNativeEncondingType ", async () => {
    try {
      let storeTypeAdapter = new StoreAdapter({
        S: undefined as any
      });
    } catch (e) {
      expect(e.message).toBe("Mapper keys cannot container reserved encoding types: S,B,U");
    }
  });

  it("throws when converter does not cover all adapter keys ", async () => {
    try {
      let storeTypeAdapter = new StoreAdapter({
        P: undefined as any
      });
    } catch (e) {
      expect(e.message).toBe("Mapper : P does not implement IAdapterMapper");
    }
  });

  it("supports ipfs ", async () => {
    let ipfsAdapter = require("../../../../../transmute-adapter-ipfs");
    let ipfs = ipfsAdapter.getStorage();

    let storeTypeAdapter = new StoreAdapter({
      I: {
        keyName: "multihash",
        adapter: ipfsAdapter,
        db: ipfs,
        readIDFromBytes32: (bytes32: string) => {
          return bs58.encode(new Buffer("1220" + bytes32.slice(2), "hex"));
        },
        writeIDToBytes32: (id: string) => {
          return "0x" + new Buffer(bs58.decode(id).slice(2)).toString("hex");
        }
      }
    });
    let payload = {
      multihash: "QmcEMXuJYiyDQpbU1BaFQngaBajPEs9UUHuQnPUYSLWa1B"
    };
    let encodedId = storeTypeAdapter.mapper["I"].writeIDToBytes32(payload.multihash);
    let decodedId = storeTypeAdapter.mapper["I"].readIDFromBytes32(encodedId);
    expect(payload.multihash).toBe(decodedId);
  });
});
