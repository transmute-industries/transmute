"use strict";
import * as _ from "lodash";
import TransmuteFramework from "../../transmute-framework";

import { DEVELOPMENT, PRODUCTION } from "../../config/transmute";

let contractArtifacts = {
  aca: require("../../../build/contracts/RBAC"),
  esa: require("../../../build/contracts/RBACEventStore"),
  esfa: require("../../../build/contracts/RBACEventStoreFactory")
};

let injectedConfig = Object.assign(DEVELOPMENT, contractArtifacts);

let T = TransmuteFramework.init(injectedConfig);

const { web3, EventStoreContract, EventStoreFactoryContract } = T;

describe("EventStore", () => {
  let eventStore;
  let accounts;

  beforeAll(async () => {
    accounts = await T.getAccounts();
    eventStore = await EventStoreContract.deployed();
  });

  describe("Solidity Typed Events", () => {
    // it("cannot be an array", async () => {
    //   try {
    //     let receipt = await T.EventStore.writeFSA(eventStore, accounts[0], {
    //       type: "REQUEST",
    //       payload: []
    //     });
    //   } catch (e) {
    //     expect(e.message).toBe("fsa.payload cannot be an array.");
    //   }
    // });
    // it("converts small strings to bytes32", async () => {
    //   let receipt = await T.EventStore.writeFSA(eventStore, accounts[0], {
    //     type: "REQUEST",
    //     payload: {
    //       bytes32: "this is a test"
    //     }
    //   });
    // });

    // it("fails for long strings", async () => {
    //   try {
    //     let receipt = await T.EventStore.writeFSA(eventStore, accounts[0], {
    //       type: "REQUEST",
    //       payload: {
    //         bytes32:
    //           "11111111111111111111111111111111111111111111111111111111111111111111111111111111"
    //       }
    //     });
    //   } catch (e) {
    //     expect(e.message).toBe(
    //       "solidity bytes32 type exceeded 32 bytes: 80 chars"
    //     );
    //   }
    // });

    // it("supports reasonable sized urls", async () => {
    //   let fsa = await T.EventStore.writeFSA(eventStore, accounts[0], {
    //     type: "REQUEST",
    //     payload: {
    //       url: "https://example.com"
    //     }
    //   });
    //   expect(fsa.payload.url).toBe("https://example.com");
    // });

    it("supports 64 char hex strings...", async () => {
      let fsa = await T.EventStore.writeFSA(eventStore, accounts[0], {
        type: "REQUEST",
        payload: {
          mac: "0xedf69173b9b3258f431a92f6ada31911c6484b949e5d8cde8a51d0690c28b12d"
        }
      });
      expect(fsa.payload.mac).toBe("0xedf69173b9b3258f431a92f6ada31911c6484b949e5d8cde8a51d0690c28b12d");
    });
  });
});
