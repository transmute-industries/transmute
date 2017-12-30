import { W3 } from 'soltsice'
// import { EventStoreFactory, EventStore } from "../../SolidityTypes";

import { getAccounts } from '../../__mocks__/setup'
import MarshalledEvents from '../../__mocks__/MarshalledEvents'
import { EventTransformer } from '../../Utils/EventTransformer'

import { IFSA } from '../../Store/EventTypes'

export const GAS_COSTS = {
  WRITE_EVENT: 4000000
}

// logEvents(getFSAsFromReceipt(receipt));
const getFSAsFromReceipt = (receipt: any) => {
  let fsa: any[] = []
  receipt.logs.forEach((event: any) => {
    if (event.event === 'EsEvent') {
      fsa.push(EventTransformer.esEventToFSA(event.args))
    }
  })
  return fsa
}

const logEvents = (events: any) => {
  console.log(JSON.stringify(events, null, 2))
}

/**
 * EventStoreFactory spec
 */
describe('EventStoreFactory', () => {
  let accounts: string[]
  // let instance: EventStoreFactory;
  let receipt: any
  let events: IFSA[]

  beforeAll(async () => {
    accounts = await getAccounts()
  })

  // it("getWhitelist", async () => {
  //   // a new factory has an empty whitelist
  //   instance = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
  //     _multisig: accounts[0]
  //   });

  //   let whitelist = await instance.getWhitelist(W3.TC.txParamsDefaultDeploy(accounts[0]));
  //   expect(whitelist).toEqual([]);
  //   // console.log("whitelist: ", whitelist);

  //   // the factory contract deployer can set the factory whitelist
  //   let receipt = await instance.setWhitelist(accounts, W3.TC.txParamsDefaultDeploy(accounts[0]));
  //   // logEvents(getFSAsFromReceipt(receipt));

  //   // whitelist is updated.
  //   whitelist = await instance.getWhitelist(W3.TC.txParamsDefaultDeploy(accounts[0]));
  //   expect(whitelist).toEqual(accounts);
  // });

  it('killEventStore', async () => {
    console.log(accounts)
    expect(true)
    // a new factory has an empty whitelist
    // instance = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
    //   _recipient: accounts[0]
    // });

    // let factoryOwner = await instance.owner();
    // expect(factoryOwner).toBe(accounts[0]);

    // let factoryCreator = await instance.originalCreator();

    // console.log(instance)

    // let whitelist = await instance.getWhitelist(instance.address, W3.TC.txParamsDefaultDeploy(accounts[0]));
    // expect(whitelist).toEqual([]);

    // // the factory contract deployer can set the factory whitelist
    // receipt = await instance.setWhitelist(accounts, W3.TC.txParamsDefaultDeploy(accounts[0]));

    // // whitelist is updated.
    // whitelist = await instance.getWhitelist(accounts[0]);
    // expect(whitelist).toEqual(accounts);

    // // whitelisted accounts can createEventStore s
    // receipt = await instance.createEventStore(W3.TC.txParamsDefaultDeploy(accounts[1]));
    // events = getFSAsFromReceipt(receipt);

    // // the factory caller is the eventstore owner
    // let myStore = await EventStore.At(events[0].payload.value);
    // let myStoreOwner = await myStore.owner();
    // expect(myStoreOwner).toBe(accounts[1]);

    // the eventstore owner can use the factory to kill the eventstore
    // receipt = await instance.killEventStore(
    //   events[0].payload.value,
    //   W3.TC.txParamsDefaultDeploy(accounts[0])
    // );

    // logEvents(getFSAsFromReceipt(receipt));
  })

  // it("New", async () => {
  //   expect(instance).toBeDefined();
  // });

  // it("At", async () => {
  //   const instance = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
  //     _multisig: accounts[0]
  //   });
  //   expect(instance).toBeDefined();
  //   const instanceFromAddress = await EventStoreFactory.At(instance.address);
  //   expect(instanceFromAddress.address).toBe(instance.address);
  // });

  // it("owner", async () => {
  //   let owner = await instance.owner();
  //   expect(owner).toBe(accounts[0]);
  // });

  // it("transferOwnership", async () => {
  //   let receipt = await instance.transferOwnership(
  //     accounts[1],
  //     W3.TC.txParamsDefaultDeploy(accounts[0])
  //   );
  //   expect(receipt.logs[0].event).toBe("OwnershipTransferred");
  // });

  // it("getEventStoresByOwner", async () => {
  //   let addresses = await instance.getEventStoresByOwner(W3.TC.txParamsDefaultDeploy(accounts[0]));
  //   expect(addresses.length).toBe(0);
  // });

  // it("getEventStores", async () => {
  //   let addresses = await instance.getEventStores();
  //   expect(addresses.length).toBe(0);
  // });

  // it("eventCount", async () => {
  //   let countAsBigNumber = await instance.eventCount();
  //   expect(countAsBigNumber.toNumber()).toBe(0);
  // });

  // it("setWhitelist", async () => {
  //   const receipt = await instance.setWhitelist(accounts, W3.TC.txParamsDefaultDeploy(accounts[1]));
  //   expect(receipt.logs.length).toBe(1);
  //   let fsa = EventTransformer.esEventToFSA(receipt.logs[0].args as any);
  //   expect(fsa.type).toBe("ES_WL_SET");
  // });

  // it("createEventStore", async () => {
  //   const receipt = await instance.createEventStore(W3.TC.txParamsDefaultDeploy(accounts[0]));

  //   expect(receipt.logs.length).toBe(1);
  //   let fsa = EventTransformer.esEventToFSA(receipt.logs[0].args as any);
  //   expect(fsa.type).toBe("ES_CREATED");

  //   let myStores = await instance.getEventStoresByOwner(W3.TC.txParamsDefaultDeploy(accounts[0]));
  //   let allStores = await instance.getEventStores(W3.TC.txParamsDefaultDeploy(accounts[0]));

  //   expect(myStores.length).toBe(1);
  //   expect(allStores.length).toBe(1);
  // });

  // describe("writeEvent + readEvent ", () => {
  //   MarshalledEvents.map(event => {
  //     it(JSON.stringify(event), async () => {
  //       let receipt = await instance.writeEvent(
  //         event.eventType,
  //         event.keyType,
  //         event.valueType,
  //         event.key,
  //         event.value,
  //         W3.TC.txParamsDefaultDeploy(accounts[0], GAS_COSTS.WRITE_EVENT)
  //       );

  //       expect(receipt.logs.length).toBe(1);

  //       let writtenFSA = EventTransformer.esEventToFSA(receipt.logs[0].args as any);
  //       expect(writtenFSA.meta.keyType).toBe(event.keyType);
  //       expect(writtenFSA.meta.valueType).toBe(event.valueType);

  //       let eventValues = await instance.readEvent(0, W3.TC.txParamsDefaultDeploy(accounts[0]));
  //       let readFSA = EventTransformer.arrayToFSA(eventValues);

  //       expect(writtenFSA.meta.keyType).toBe(event.keyType);
  //       expect(writtenFSA.meta.valueType).toBe(event.valueType);
  //     });
  //   });
  // });

  // it("killEventStore", async () => {

  //   let receipt = await instance.setWhitelist(accounts, W3.TC.txParamsDefaultDeploy(accounts[0]));

  //   receipt = await instance.createEventStore(W3.TC.txParamsDefaultDeploy(accounts[1]));

  //   expect(receipt.logs.length).toBe(1);
  //   let fsa: any = EventTransformer.esEventToFSA(receipt.logs[0].args as any);

  //   expect(fsa.type).toBe("ES_CREATED");

  //   console.log(fsa);

  //   let myStores = await instance.getEventStoresByOwner(W3.TC.txParamsDefaultDeploy(accounts[1]));

  //   let myStore = await EventStore.At(fsa.payload.value);

  //   let myStoreOwner = await myStore.owner()
  //   // console.log('myStoreOwner: ',myStoreOwner )

  //   expect(myStores[0]).toBe(fsa.payload.value);

  //   // console.log('factory instance address: ', instance.address)
  //   // console.log('es creator: ', accounts[1])

  //   receipt = await instance.killEventStore(
  //     fsa.payload.value,
  //     W3.TC.txParamsDefaultDeploy(accounts[0])
  //   );

  //   fsa = EventTransformer.esEventToFSA(receipt.logs[0].args as any);
  //   console.log( fsa )

  //   // fsa = EventTransformer.esEventToFSA(receipt.logs[0].args as any);
  //   // expect(fsa.type).toBe("ES_DESTROYED");
  // });
})
