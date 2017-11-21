
const Web3 = require('web3')

const UnsafeEventStoreFactory = artifacts.require('./TransmuteFramework/EventStore/UnsafeEventStore/UnsafeEventStoreFactory.sol')
const UnsafeEventStore = artifacts.require('./TransmuteFramework/EventStore/UnsafeEventStore/UnsafeEventStore.sol')

const {
    getFSAFromEventArgs,
    getFSAFromEventValues,
    marshal,
    unmarshal
     } = require('../../../Common')

// TODO: Write tests for common....

const { unMarshalledExpectedEvents } = require('../mock')

describe('', () => {

    let factory, eventStore

    before(async () => {
        factory = await UnsafeEventStoreFactory.deployed()
    })

    contract('UnsafeEventStore', (accounts) => {

        it('the factory caller is the event store contract creator', async () => {
            let _tx = await factory.createEventStore({ from: accounts[0], gas: 2000000 })
            let fsa = getFSAFromEventArgs(_tx.logs[0].args)
            eventStore = UnsafeEventStore.at(fsa.payload.address)
            let creator = await eventStore.creator()
            assert(creator === accounts[0])
        })

        it('the factory is the event store owner', async () => {
            let owner = await eventStore.owner()
            assert(owner === factory.address)
        })

        unMarshalledExpectedEvents.forEach((unMarshalledExpectedEvent) => {

            it('can write & read events of type ' + unMarshalledExpectedEvent.valueType, async () => {

                let originalEvent = unMarshalledExpectedEvent

                let marshalledEvent = marshal(
                    originalEvent.eventType,
                    originalEvent.keyType,
                    originalEvent.valueType,
                    originalEvent.key,
                    originalEvent.value
                )

                let _tx = await eventStore.writeEvent(
                    marshalledEvent.eventType,
                    marshalledEvent.keyType,
                    marshalledEvent.valueType,
                    marshalledEvent.key,
                    marshalledEvent.value,
                    { from: accounts[0], gas: 2000000 }
                )

                let event = _tx.logs[0].args
                let eventId = event.Id.toNumber()

                let fsa = getFSAFromEventArgs(event)

                assert.equal(originalEvent.eventType, fsa.type)
                assert.equal(originalEvent.key, Object.keys(fsa.payload)[0])
                assert.equal(originalEvent.value, fsa.payload[Object.keys(fsa.payload)[0]])

                let esEventValues = await eventStore.readEvent.call(eventId, {
                    from: accounts[0]
                })

                assert.equal(esEventValues[0].toNumber(), eventId)
                assert.equal(esEventValues[1], accounts[0])

                fsa = getFSAFromEventValues( ...esEventValues )
                // console.log(fsa)
                assert.equal(originalEvent.eventType, fsa.type)
                assert.equal(originalEvent.key, Object.keys(fsa.payload)[0])
                assert.equal(originalEvent.value, fsa.payload[Object.keys(fsa.payload)[0]])
            })
        })
    })
})
