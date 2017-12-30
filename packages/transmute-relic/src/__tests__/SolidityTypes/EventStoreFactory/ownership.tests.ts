import { W3 } from 'soltsice'
import { EventStoreFactory, EventStore } from '../../../SolidityTypes'

import { getAccounts } from '../../../__mocks__/setup'
import MarshalledEvents from '../../../__mocks__/MarshalledEvents'
import { EventTransformer } from '../../../Utils/EventTransformer'

import { IFSA } from '../../../Store/EventTypes'

export const GAS_COSTS = {
  WRITE_EVENT: 4000000
}

// logEvents(getFSAsFromReceipt(receipt));
const logEvents = (events: any) => {
  console.log(JSON.stringify(events, null, 2))
}

/**
 * EventStoreFactory spec
 */
describe('EventStoreFactory', () => {
  let accounts: string[]
  let factory: EventStoreFactory
  let receipt: any
  let events: IFSA[]

  beforeAll(async () => {
    accounts = await getAccounts()
  })

  describe('factory ownership', async () => {
    it('the factory owner is the creator (caller of New)', async () => {
      // create a new factory
      factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
        _multisig: accounts[0]
      })

      // the factory owner is the factory contract deployer
      let factoryOwner = await factory.owner()
      expect(factoryOwner).toBe(accounts[0])
    })

    it('the factory owner can transferOwnership', async () => {
      // create a new factory
      factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
        _multisig: accounts[0]
      })

      // the factory owner can transferOwnership
      let receipt = await factory.transferOwnership(
        accounts[1],
        W3.TC.txParamsDefaultDeploy(accounts[0])
      )
      events = EventTransformer.getFSAsFromReceipt(receipt)
      expect(events[0].type).toBe('NEW_OWNER')
      expect(events[0].payload.value).toBe(accounts[1])

      // the event was not a lie
      let factoryOwner = await factory.owner()
      expect(factoryOwner).toBe(accounts[1])
    })
  })

  // it("factories can create event stores, and ownership of stores can be transfered", async () => {
  //   // create a new factory
  //   factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
  //     _multisig: accounts[0]
  //   });

  //   // the factory owner is the factory contract deployer
  //   let factoryOwner = await factory.owner();
  //   expect(factoryOwner).toBe(accounts[0]);

  //   // the factory creator is the factory contract deployer
  //   let factoryCreator = await factory.creatorTxOrigin();
  //   expect(factoryCreator).toBe(factoryOwner);

  //   // // anyone can use the factory to create an eventStore
  //   // receipt = await factory.createEventStore(accounts, W3.TC.txParamsDefaultDeploy(accounts[1]))
  //   // events = EventTransformer.getFSAsFromReceipt(receipt)
  //   // // let eventStore = await EventStore.At(events[1].payload.value);

  //   // let factoryDerivedStoreEvents = EventTransformer.filterEventsByMeta(
  //   //   events,
  //   //   'msgSender',
  //   //   factory.address
  //   // )
  //   // console.log('factoryDerivedStoreEvents: ', factoryDerivedStoreEvents)

  //   // let factoryEvents = EventTransformer.filterEventsByMeta(events, 'msgSender', accounts[1])
  //   // console.log('factoryEvents: ', factoryEvents)
  //   // expect(factoryEvents[0].meta.txOrigin).toBe(accounts[1])

  //   // the eventStore owner is the factory caller
  //   // let eventStoreOwner = await eventStore.owner();
  //   // expect(eventStoreOwner).toBe(accounts[1]);

  //   // the eventStore creator is the factory caller
  //   // let eventStoreCreator = await eventStore.creatorTxOrigin();
  //   // expect(eventStoreCreator).toBe(accounts[1]);

  //   // the factory owner can transferOwnership
  //   // receipt = await factory.transferOwnership(accounts[2], W3.TC.txParamsDefaultDeploy(factoryOwner));
  //   // events = getFSAsFromReceipt(receipt);
  //   // console.log(events)

  //   // events = getFSAsFromReceipt(receipt);
  //   // console.log(events)
  //   // console.log(receipt)
  // });
})

// it("New", async () => {
//   expect(factory).toBeDefined();
// });

// it("At", async () => {
//   const factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
//     _multisig: accounts[0]
//   });
//   expect(factory).toBeDefined();
//   const factoryFromAddress = await EventStoreFactory.At(factory.address);
//   expect(factoryFromAddress.address).toBe(factory.address);
// });

// it("owner", async () => {
//   let owner = await factory.owner();
//   expect(owner).toBe(accounts[0]);
// });

// it("transferOwnership", async () => {
//   let receipt = await factory.transferOwnership(
//     accounts[1],
//     W3.TC.txParamsDefaultDeploy(accounts[0])
//   );
//   expect(receipt.logs[0].event).toBe("OwnershipTransferred");
// });

// it("getEventStoresByOwner", async () => {
//   let addresses = await factory.getEventStoresByOwner(W3.TC.txParamsDefaultDeploy(accounts[0]));
//   expect(addresses.length).toBe(0);
// });

// it("getEventStores", async () => {
//   let addresses = await factory.getEventStores();
//   expect(addresses.length).toBe(0);
// });

// it("eventCount", async () => {
//   let countAsBigNumber = await factory.eventCount();
//   expect(countAsBigNumber.toNumber()).toBe(0);
// });

// it("setWhitelist", async () => {
//   const receipt = await factory.setWhitelist(accounts, W3.TC.txParamsDefaultDeploy(accounts[1]));
//   expect(receipt.logs.length).toBe(1);
//   let fsa = EventTransformer.esEventToFSA(receipt.logs[0].args as any);
//   expect(fsa.type).toBe("ES_WL_SET");
// });

// it("createEventStore", async () => {
//   const receipt = await factory.createEventStore(W3.TC.txParamsDefaultDeploy(accounts[0]));

//   expect(receipt.logs.length).toBe(1);
//   let fsa = EventTransformer.esEventToFSA(receipt.logs[0].args as any);
//   expect(fsa.type).toBe("ES_CREATED");

//   let eventStores = await factory.getEventStoresByOwner(W3.TC.txParamsDefaultDeploy(accounts[0]));
//   let allStores = await factory.getEventStores(W3.TC.txParamsDefaultDeploy(accounts[0]));

//   expect(eventStores.length).toBe(1);
//   expect(allStores.length).toBe(1);
// });

// describe("writeEvent + readEvent ", () => {
//   MarshalledEvents.map(event => {
//     it(JSON.stringify(event), async () => {
//       let receipt = await factory.writeEvent(
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

//       let eventValues = await factory.readEvent(0, W3.TC.txParamsDefaultDeploy(accounts[0]));
//       let readFSA = EventTransformer.arrayToFSA(eventValues);

//       expect(writtenFSA.meta.keyType).toBe(event.keyType);
//       expect(writtenFSA.meta.valueType).toBe(event.valueType);
//     });
//   });
// });

// it("killEventStore", async () => {

//   let receipt = await factory.setWhitelist(accounts, W3.TC.txParamsDefaultDeploy(accounts[0]));

//   receipt = await factory.createEventStore(W3.TC.txParamsDefaultDeploy(accounts[1]));

//   expect(receipt.logs.length).toBe(1);
//   let fsa: any = EventTransformer.esEventToFSA(receipt.logs[0].args as any);

//   expect(fsa.type).toBe("ES_CREATED");

//   console.log(fsa);

//   let eventStores = await factory.getEventStoresByOwner(W3.TC.txParamsDefaultDeploy(accounts[1]));

//   let eventStore = await EventStore.At(fsa.payload.value);

//   let eventStoreOwner = await eventStore.owner()
//   // console.log('eventStoreOwner: ',eventStoreOwner )

//   expect(eventStores[0]).toBe(fsa.payload.value);

//   // console.log('factory factory address: ', factory.address)
//   // console.log('es creator: ', accounts[1])

//   receipt = await factory.killEventStore(
//     fsa.payload.value,
//     W3.TC.txParamsDefaultDeploy(accounts[0])
//   );

//   fsa = EventTransformer.esEventToFSA(receipt.logs[0].args as any);
//   console.log( fsa )

//   // fsa = EventTransformer.esEventToFSA(receipt.logs[0].args as any);
//   // expect(fsa.type).toBe("ES_DESTROYED");
// });

// save for eventstore
// it("getWhitelist", async () => {
//   // a new factory has an empty whitelist
//   factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
//     _multisig: accounts[0]
//   });

//   let whitelist = await factory.getWhitelist(W3.TC.txParamsDefaultDeploy(accounts[0]));
//   expect(whitelist).toEqual([]);
//   // console.log("whitelist: ", whitelist);

//   // the factory contract deployer can set the factory whitelist
//   let receipt = await factory.setWhitelist(accounts, W3.TC.txParamsDefaultDeploy(accounts[0]));
//   // logEvents(getFSAsFromReceipt(receipt));

//   // whitelist is updated.
//   whitelist = await factory.getWhitelist(W3.TC.txParamsDefaultDeploy(accounts[0]));
//   expect(whitelist).toEqual(accounts);

//  // the factory whitelist is empty initially
//  let whitelist = await factory.getWhitelist(W3.TC.txParamsDefaultDeploy(accounts[0]))
//  expect(whitelist).toEqual([])

//  // the factory owner can set the factory whitelist
//  receipt = await factory.setWhitelist(accounts, W3.TC.txParamsDefaultDeploy(accounts[0]))
//  events = EventTransformer.getFSAsFromReceipt(receipt);
//  expect(events[0].type).toBe('F_WL_SET')

//  // the factory whitelist is updated, and included the factory address
//  whitelist = await factory.getWhitelist()
//  expect(whitelist).toEqual([...accounts])
// });
