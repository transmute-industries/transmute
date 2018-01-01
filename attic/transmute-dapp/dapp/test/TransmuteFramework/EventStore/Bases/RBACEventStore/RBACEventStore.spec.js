
const Web3 = require('web3')

const RBACEventStoreFactory = artifacts.require('./TransmuteFramework/EventStore/RBACEventStore/RBACEventStoreFactory.sol')
const RBACEventStore = artifacts.require('./TransmuteFramework/EventStore/RBACEventStore/RBACEventStore.sol')

const {
    getFSAFromEventArgs,
    getFSAFromEventValues,
    marshal,
    unmarshal,
    isVmException,
    grantItemFromEvent
     } = require('../../../Common')

// TODO: Write tests for common....

const { unMarshalledExpectedEvents } = require('../mock')


describe('', () => {

    let factory, eventStore, tx, fsa, owner

    before(async () => {
        factory = await RBACEventStoreFactory.deployed()
    })

    contract('RBACEventStore', (accounts) => {

        it('the factory caller is the event store contract owner', async () => {
            tx = await factory.createEventStore({ from: accounts[0], gas: 2000000 })
            fsa = getFSAFromEventArgs(tx.logs[0].args)
            eventStore = RBACEventStore.at(fsa.payload.address)
            owner = await eventStore.owner()
            assert(owner === accounts[0])
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

                let tx = await eventStore.writeEvent(
                    marshalledEvent.eventType,
                    marshalledEvent.keyType,
                    marshalledEvent.valueType,
                    marshalledEvent.key,
                    marshalledEvent.value,
                    { from: accounts[0], gas: 2000000 }
                )

                let event = tx.logs[0].args
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

                fsa = getFSAFromEventValues(...esEventValues)
                // console.log(fsa)
                assert.equal(originalEvent.eventType, fsa.type)
                assert.equal(originalEvent.key, Object.keys(fsa.payload)[0])
                assert.equal(originalEvent.value, fsa.payload[Object.keys(fsa.payload)[0]])
            })
        })
        describe('DAC', async () => {

            it('only event store contract owner can write events', async () => {
                let originalEvent = unMarshalledExpectedEvents[0]
                let marshalledEvent = marshal(
                    originalEvent.eventType,
                    originalEvent.keyType,
                    originalEvent.valueType,
                    originalEvent.key,
                    originalEvent.value
                )
                let tx = await eventStore.writeEvent(
                    marshalledEvent.eventType,
                    marshalledEvent.keyType,
                    marshalledEvent.valueType,
                    marshalledEvent.key,
                    marshalledEvent.value,
                    { from: accounts[0], gas: 2000000 }
                )

                try {
                    tx = await eventStore.writeEvent(
                        marshalledEvent.eventType,
                        marshalledEvent.keyType,
                        marshalledEvent.valueType,
                        marshalledEvent.key,
                        marshalledEvent.value,
                        { from: accounts[1], gas: 2000000 }
                    )
                } catch (e) {
                    assert(isVmException(e), 'expected vm exception when not owner')
                }
            })
            describe('owner can authorize other accounts to writeEvent', async () => {
                it('owner can grant admin role event create:any', async () => {
                    tx = await eventStore.setGrant('admin', 'event', 'create:any', ['*'], {
                        from: accounts[0]
                    })
                    grant = grantItemFromEvent(tx.logs[0].args)
                    assert(grant.role, 'admin', 'expected grant.role to be admin')
                    // TODO: add more tests here...
                    fsa = getFSAFromEventArgs(tx.logs[1].args)
                    assert(fsa.type, 'AC_GRANT_WRITTEN', 'expected event.type to be AC_GRANT_WRITTEN')
                    // console.log(fsa)
                })

                it('owner can make account 1 an admin', async () => {
                    tx = await eventStore.setAddressRole(accounts[1], 'admin', {
                        from: accounts[0]
                    })
                    fsa = getFSAFromEventArgs(tx.logs[0].args)
                    assert.equal(fsa.type, 'AC_ROLE_ASSIGNED', 'expect AC_ROLE_ASSIGNED event')
                    assert.equal(fsa.payload[accounts[1]], 'admin', 'expect account1 to be assigned admin')
                    // TODO: add more tests here...
                })

                it('account1 can write event', async () => {
                    let originalEvent = unMarshalledExpectedEvents[0]
                    let marshalledEvent = marshal(
                        originalEvent.eventType,
                        originalEvent.keyType,
                        originalEvent.valueType,
                        originalEvent.key,
                        originalEvent.value
                    )
                    let tx = await eventStore.writeEvent(
                        marshalledEvent.eventType,
                        marshalledEvent.keyType,
                        marshalledEvent.valueType,
                        marshalledEvent.key,
                        marshalledEvent.value,
                        { from: accounts[1], gas: 2000000 }
                    )
                })

                it('account2 can not write event', async () => {
                    let originalEvent = unMarshalledExpectedEvents[0]
                    let marshalledEvent = marshal(
                        originalEvent.eventType,
                        originalEvent.keyType,
                        originalEvent.valueType,
                        originalEvent.key,
                        originalEvent.value
                    )
                    try {
                        let tx = await eventStore.writeEvent(
                            marshalledEvent.eventType,
                            marshalledEvent.keyType,
                            marshalledEvent.valueType,
                            marshalledEvent.key,
                            marshalledEvent.value,
                            { from: accounts[2], gas: 2000000 }
                        )
                    } catch (e) {
                        assert(isVmException(e), 'expected vm exception when not owner')
                    }
                })
            })
        })
    })
})
