import { Utils } from "../Utils";

import { BigNumber } from "bignumber.js";

/**
 * Utils test
 */
describe("Utils", () => {
  it("Utils is defined", () => {
    expect(Utils).toBeDefined();
  });

  it("toAscii works..", () => {
    expect(
      Utils.toAscii("0x45535f4352454154454400000000000000000000000000000000000000000000")
    ).toBe("ES_CREATED");
    console.log();
  });

  it("getFSAFromEventArgs", () => {

    let receiptEventArgs = {
      Id: new BigNumber("0"),
      TxOrigin: "0xf202da19a633142b088dd400a1170b68d6b7826c",
      Created: new BigNumber("1514070783"),
      EventType: "0x45535f4352454154454400000000000000000000000000000000000000000000",
      KeyType: "0x53",
      ValueType: "0x41",
      Key: "0x6164647265737300000000000000000000000000000000000000000000000000",
      Value: "0x0000000000000000000000003e35ab51df0b1024e0627566d1713c3e88a3a005"
    };

    let expectedFSA = {
      type: "ES_CREATED",
      payload: { address: "0x3e35ab51df0b1024e0627566d1713c3e88a3a005" },
      meta: { id: 0, created: 1514070783, txOrigin: "0xf202da19a633142b088dd400a1170b68d6b7826c", keyType: "S", valueType: "A"}
    };

    let fsa = Utils.getFSAFromEventArgs(receiptEventArgs);

    expect(fsa).toEqual(expectedFSA);

  });
});
