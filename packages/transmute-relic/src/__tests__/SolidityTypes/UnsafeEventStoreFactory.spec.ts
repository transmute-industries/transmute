import { W3 } from "soltsice";
import { UnsafeEventStoreFactory } from "../../SolidityTypes";

import { getAccounts } from "../../__mocks__/setup";
import MarshalledEvents from "../../__mocks__/MarshalledEvents";
import { EventTransformer } from "../../Utils/EventTransformer";

export const GAS_COSTS = {
  WRITE_EVENT: 4000000
};

/**
 * UnsafeEventStoreFactory spec
 */
describe("UnsafeEventStoreFactory", () => {
  let accounts: string[];
  let instance: UnsafeEventStoreFactory;

  beforeAll(async () => {
    accounts = await getAccounts();
    instance = await UnsafeEventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
      _multisig: accounts[0]
    });
  });

  it("New", async () => {
    expect(instance).toBeDefined();
  });

  it("At", async () => {
    const instance = await UnsafeEventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
      _multisig: accounts[0]
    });
    expect(instance).toBeDefined();
    const instanceFromAddress = await UnsafeEventStoreFactory.At(instance.address);
    expect(instanceFromAddress.address).toBe(instance.address);
  });

  it("owner", async () => {
    let owner = await instance.owner();
    expect(owner).toBe(accounts[0]);
  });

  it("transferOwnership", async () => {
    let receipt = await instance.transferOwnership(
      accounts[1],
      W3.TC.txParamsDefaultDeploy(accounts[0])
    );
    expect(receipt.logs[0].event).toBe("OwnershipTransferred");
  });

  it("getEventStoresByOwner", async () => {
    let addresses = await instance.getEventStoresByOwner(W3.TC.txParamsDefaultDeploy(accounts[0]));
    expect(addresses.length).toBe(0);
  });

  it("getEventStores", async () => {
    let addresses = await instance.getEventStores();
    expect(addresses.length).toBe(0);
  });

  it("eventCount", async () => {
    let countAsBigNumber = await instance.eventCount();
    expect(countAsBigNumber.toNumber()).toBe(0);
  });

  it("createEventStore", async () => {
    const receipt = await instance.createEventStore(W3.TC.txParamsDefaultDeploy(accounts[0]));
    expect(receipt.logs.length).toBe(1);
    let fsa = EventTransformer.esEventToFSA(receipt.logs[0].args as any);
    expect(fsa.type).toBe("ES_CREATED");

    let myStores = await instance.getEventStoresByOwner(W3.TC.txParamsDefaultDeploy(accounts[0]));
    let allStores = await instance.getEventStores(W3.TC.txParamsDefaultDeploy(accounts[0]));

    expect(myStores.length).toBe(1);
    expect(allStores.length).toBe(1);
  });

  describe("writeEvent + readEvent ", () => {
    MarshalledEvents.map(event => {
      it(JSON.stringify(event), async () => {
        let receipt = await instance.writeEvent(
          event.eventType,
          event.keyType,
          event.valueType,
          event.key,
          event.value,
          W3.TC.txParamsDefaultDeploy(accounts[0], GAS_COSTS.WRITE_EVENT)
        );

        expect(receipt.logs.length).toBe(1);

        let writtenFSA = EventTransformer.esEventToFSA(receipt.logs[0].args as any);
        expect(writtenFSA.meta.keyType).toBe(event.keyType);
        expect(writtenFSA.meta.valueType).toBe(event.valueType);

        let eventValues = await instance.readEvent(0, W3.TC.txParamsDefaultDeploy(accounts[0]));
        let readFSA = EventTransformer.arrayToFSA(eventValues);

        expect(writtenFSA.meta.keyType).toBe(event.keyType);
        expect(writtenFSA.meta.valueType).toBe(event.valueType);
      });
    });
  });

  it("killEventStore", async () => {
    let receipt = await instance.createEventStore(W3.TC.txParamsDefaultDeploy(accounts[1]));
    expect(receipt.logs.length).toBe(1);
    let fsa: any = EventTransformer.esEventToFSA(receipt.logs[0].args as any);
    expect(fsa.type).toBe("ES_CREATED");
    let myStores = await instance.getEventStoresByOwner(W3.TC.txParamsDefaultDeploy(accounts[1]));
    expect(myStores[0]).toBe(fsa.payload.value);
    receipt = await instance.killEventStore(
      fsa.payload.value,
      W3.TC.txParamsDefaultDeploy(accounts[1])
    );
    fsa = EventTransformer.esEventToFSA(receipt.logs[0].args as any);
    expect(fsa.type).toBe("ES_DESTROYED");
  });
});
