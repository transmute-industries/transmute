// import { W3 } from 'soltsice'
// import { EventStoreFactory, EventStore } from '../../../SolidityTypes'

// import { getAccounts } from '../../../__mocks__/setup'
// import MarshalledEvents from '../../../__mocks__/MarshalledEvents'
// import { EventTransformer } from '../../../Utils/EventTransformer'

// import { IFSA } from '../../../Store/EventTypes'

// export const GAS_COSTS = {
//   WRITE_EVENT: 4000000
// }

// // logEvents(getFSAsFromReceipt(receipt));
// const logEvents = (events: any) => {
//   console.log(JSON.stringify(events, null, 2))
// }

// /**
//  * EventStoreFactory spec
//  */
// describe('EventStoreFactory', () => {
//   let accounts: string[]
//   let factory: EventStoreFactory
//   let receipt: any
//   let events: IFSA[]

//   beforeAll(async () => {
//     accounts = await getAccounts()
//   })

//   describe('factory ownership', async () => {
//     it('the factory owner is the creator (caller of New)', async () => {
//       // create a new factory
//       factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
//         _multisig: accounts[0]
//       })

//       // the factory owner is the factory contract deployer
//       let factoryOwner = await factory.owner()
//       expect(factoryOwner).toBe(accounts[0])
//     })

//     it('the factory owner can transferOwnership', async () => {
//       // create a new factory
//       factory = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(accounts[0]), {
//         _multisig: accounts[0]
//       })

//       // the factory owner can transferOwnership
//       let receipt = await factory.transferOwnership(
//         accounts[1],
//         W3.TC.txParamsDefaultDeploy(accounts[0])
//       )
//       events = EventTransformer.getFSAsFromReceipt(receipt)
//       expect(events[0].type).toBe('NEW_OWNER')
//       expect(events[0].payload.value).toBe(accounts[1])

//       // the event was not a lie
//       let factoryOwner = await factory.owner()
//       expect(factoryOwner).toBe(accounts[1])
//     })
//   })

// })
