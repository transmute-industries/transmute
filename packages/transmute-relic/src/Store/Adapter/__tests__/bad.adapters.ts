import { Adapter } from '../index'

const bs58 = require('bs58')

let ipfsAdapter = require('../../../../../../transmute-adapter-ipfs')
let leveldbAdapter = require('../../../../../../transmute-adapter-leveldb')

let adapterMap = {
  I: {
    adapter: ipfsAdapter,
    db: ipfsAdapter.getStorage()
  },
  L: {
    adapter: leveldbAdapter,
    db: leveldbAdapter.getStorage()
  }
}

/**
 * Adapter tests
 */
describe('Adapter tests', () => {
  // it("throws errors when passed TransmuteNativeEncondingType ", async () => {
  //   try {
  //     let storeTypeAdapter = new Adapter(adapterMap);
  //   } catch (e) {
  //     expect(e.message).toBe("Mapper keys cannot container reserved encoding types: S,B,U");
  //   }
  // });
  // it("throws when converter is not defined ", async () => {
  //   try {
  //     let storeTypeAdapter = new Adapter(adapterMap, undefined);
  //   } catch (e) {
  //     expect(e.message).toBe("Adapter requires converter");
  //   }
  // });
  // it("throws when converter does not cover all adapter keys ", async () => {
  //   try {
  //     let storeTypeAdapter = new Adapter(adapterMap, {
  //       L: {
  //         fromBytes32ToIdentifier: (bytes32: string) => {
  //           console.log("some bytes32 ", bytes32);
  //         }
  //       }
  //     });
  //   } catch (e) {
  //     expect(e.message).toBe("Converter not populated for adapter type: I");
  //   }
  // });
  // it("throws when converter does implement ITransmuteAdapterTypeConverter ", async () => {
  //   try {
  //     let storeTypeAdapter = new Adapter(adapterMap, {
  //       L: {
  //         fromBytes32ToIdentifier: (bytes32: string) => {
  //           console.log("some bytes32 ", bytes32);
  //         }
  //       },
  //       I: {
  //         fromBytes32ToIdentifier: (bytes32: string) => {
  //           console.log("some bytes32 ", bytes32);
  //         }
  //       }
  //     });
  //   } catch (e) {
  //     expect(e.message).toBe("Converter : I does not implement ITransmuteAdapterTypeConverter");
  //   }
  // });
  // it("supports ipfs ", async () => {
  //   let storeTypeAdapter = new Adapter(
  //     {
  //       I: adapterMap.I
  //     },
  //     {
  //       I: {
  //         readIDFromBytes32: (bytes32: string) => {
  //           return bs58.encode(new Buffer("1220" + bytes32.slice(2), "hex"));
  //         },
  //         writeIDToBytes32: (id: string) => {
  //           return "0x" + new Buffer(bs58.decode(id).slice(2)).toString("hex");
  //         }
  //       }
  //     }
  //   );
  //   let payload = {
  //     multihash: "QmcEMXuJYiyDQpbU1BaFQngaBajPEs9UUHuQnPUYSLWa1B"
  //   };
  //   let encodedId = storeTypeAdapter.converter["I"].writeIDToBytes32(payload.multihash);
  //   let decodedId = storeTypeAdapter.converter["I"].readIDFromBytes32(encodedId);
  //   expect(payload.multihash).toBe(decodedId);
  // });
})
