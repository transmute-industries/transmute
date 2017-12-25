
const bs58 = require("bs58");
import { Adapter } from "../index";

/**
 * Bad adapter tests
 */
describe("Bad adapter tests", () => {
  it("throws errors when passed TransmuteNativeEncondingType ", async () => {
    try {
      let storeTypeAdapter = new Adapter(
        {
          S: undefined as any
        },
        {}
      );
    } catch (e) {
      expect(e.message).toBe("Mapper keys cannot container reserved encoding types: S,B,U");
    }
  });

  it("throws when converter is not defined ", async () => {
    try {
      let storeTypeAdapter = new Adapter(
        {
          P: undefined as any
        },
        undefined
      );
    } catch (e) {
      expect(e.message).toBe("Adapter requires converter");
    }
  });

  it("throws when converter does not cover all adapter keys ", async () => {
    try {
      let storeTypeAdapter = new Adapter(
        {
          P: undefined as any
        },
        {
          L: undefined as any
        }
      );
    } catch (e) {
      expect(e.message).toBe("Converter not populated for adapter type: P");
    }
  });

  it("throws when converter does implement ITransmuteAdapterTypeConverter ", async () => {
    try {
      let storeTypeAdapter = new Adapter(
        {},
        {
          L: {
            fromBytes32ToIdentifier: (bytes32: string) => {
              console.log("some bytes32 ", bytes32);
            }
          },
          I: {
            fromBytes32ToIdentifier: (bytes32: string) => {
              console.log("some bytes32 ", bytes32);
            }
          }
        }
      );
    } catch (e) {
      expect(e.message).toBe("Converter : I does not implement ITransmuteAdapterTypeConverter");
    }
  });

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
