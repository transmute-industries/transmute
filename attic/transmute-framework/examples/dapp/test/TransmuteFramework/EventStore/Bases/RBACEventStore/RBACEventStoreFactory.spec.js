var Web3 = require('web3')
var RBACEventStoreFactory = artifacts.require('./TransmuteFramework/EventStore/Bases/RBACEventStoreFactory/RBACEventStoreFactory.sol')
var RBACEventStore = artifacts.require('./TransmuteFramework/EventStore/Bases/RBACEventStoreFactory/RBACEventStore.sol')

var _ = require('lodash')

const {
    getFSAFromEventArgs,
    getFSAFromEventValues,
    isVmException,
    grantItemFromEvent
} = require('../../../Common')

describe('', () => {

    contract('RBACEventStoreFactory', function (accounts) {

        var factory = null
        var account1EventStoreAddresses = []
        var eventStoreAddresses = []

        before(async () => {
            factory = await RBACEventStoreFactory.deployed()
            // console.log('factory.address: ', factory.address)
        })

        it('deployed', async () => {
            let owner = await factory.owner()
            // console.log('factory.owner: ', owner)
            assert(owner === accounts[0])
        })

        it('createEventStore.call', async () => {
            let firstEventStoreAddress = await factory.createEventStore.call({ from: accounts[0] })
            let _tx = await factory.createEventStore({ from: accounts[0], gas: 2000000 })
            let event = _tx.logs[0].args

            let fsa = getFSAFromEventArgs(event)

            assert.equal(fsa.type, 'ES_CREATED', 'expect first event to be Type ES_CREATED')
            assert.equal(fsa.payload.address, firstEventStoreAddress, 'expected es contract address to match call')

            eventStoreAddresses.push(fsa.payload.address)
            account1EventStoreAddresses.push(fsa.payload.address)
        })

        it('createEventStore', async () => {
            // Create firstEventStore
            let _tx = await factory.createEventStore({ from: accounts[0], gas: 2000000 })
            let event = _tx.logs[0].args
            let fsa = getFSAFromEventArgs(event)
            assert.equal(fsa.type, 'ES_CREATED', 'expect first event to be Type ES_CREATED')
            // assert.equal(data, firstEventStoreAddress, 'expected es contract address to match call')
            let escAddresss = fsa.payload.address
            let esc = await RBACEventStore.at(escAddresss)
            let escOwner = await esc.owner()
            assert.equal(escOwner, accounts[0], 'expect factory caller to be es contract owner.')

            eventStoreAddresses.push(escAddresss)
            account1EventStoreAddresses.push(escAddresss)
        })

        it('getEventStores', async () => {
            let _addresses = await factory.getEventStores()
            assert(_.difference(eventStoreAddresses, _addresses).length === 0, 'Expect eventStoreAddresses to equal _addresses')
        })

        it('getEventStoresByCreator', async () => {
            let _account1EventStoreAddresses = await factory.getEventStoresByCreator.call({ from: accounts[1] })
            assert(_.difference(_account1EventStoreAddresses, account1EventStoreAddresses).length === 0, 'Expect _account1EventStoreAddresses to equal account1EventStoreAddresses')
        })

        it('killEventStore', async () => {
            // Address 0 is the deployer of the factory, and the only one who can destroy stores with it.
            let _tx = await factory.killEventStore(account1EventStoreAddresses[0], { from: accounts[0] })
            let event = _tx.logs[0].args
            let fsa = getFSAFromEventArgs(event)
            assert.equal(fsa.payload.address, account1EventStoreAddresses[0], 'Expect the destroyed address in event to match the method call')
        })

        it('getEventStores', async () => {
            let _addresses = await factory.getEventStores()
            assert(!_.includes(_addresses, account1EventStoreAddresses[0]), 'Expect killed store to not be in factory list')
            assert(_.includes(_addresses, account1EventStoreAddresses[1]), 'Expect non killed store to be in list')
        })

        describe('DAC', async () => {

            let tx, fsa, grant;
            /*
                Here we implement discretionary access control flow, for an RBACEventStoreFactory.
                We must show that:
                - the default case is writeable only by the owner.
                - only an account with eventstore create:any role can create event stores.
                - accounts can loose roles, and thereby access to contracts
                - an adversary cannot succeed at data poisoning attacks
                - an authorized role cannot exceed or grant permissions which exceed their own.
            */
            it('only owner can createEventStore', async () => {

                try {
                    let tx = await factory.createEventStore({ from: accounts[3], gas: 2000000 })
                } catch (e) {
                    assert(isVmException(e), 'expected vm exception when not owner')
                }
                tx = await factory.createEventStore({ from: accounts[0], gas: 2000000 })
                fsa = getFSAFromEventArgs(tx.logs[0].args)
                assert.equal(fsa.type, 'ES_CREATED', 'expect first event to be Type ES_CREATED')
            })

            describe('owner can authorize other accounts to createEventStore', async () => {

                it('owner can make account 1 an admin', async () => {
                    // console.log(factory.setAddressRole)
                    // let owner1 = await factory.owner()
                    // console.log(owner1, accounts[0])
                    tx = await factory.setAddressRole(accounts[1], 'admin', {
                        from: accounts[0]
                    })
                    fsa = getFSAFromEventArgs(tx.logs[0].args)
                    assert.equal(fsa.type, 'AC_ROLE_ASSIGNED', 'expect AC_ROLE_ASSIGNED event')
                    assert.equal(fsa.payload[accounts[1]], 'admin', 'expect account1 to be assigned admin')
                    // TODO: add more tests here...
                })

                it('owner can grant admin role create:any eventstore', async () => {
                    tx = await factory.setGrant('admin', 'eventstore', 'create:any', ['*'], {
                        from: accounts[0]
                    })
                    grant = grantItemFromEvent(tx.logs[0].args)
                    assert(grant.role, 'admin', 'expected grant.role to be admin')
                    // TODO: add more tests here...
                    fsa = getFSAFromEventArgs(tx.logs[1].args)
                    assert(fsa.type, 'AC_GRANT_WRITTEN', 'expected event.type to be AC_GRANT_WRITTEN')
                })

                it('account1 can createEventStore', async () => {
                    tx = await factory.createEventStore({
                        from: accounts[1],
                        gas: 2000000
                    })
                    fsa = getFSAFromEventArgs(tx.logs[0].args)
                    assert(fsa.type, 'ES_CREATED', 'expected event store created')
                })

                it('account2 can not createEventStore', async () => {
                    try {
                        tx = await factory.createEventStore({
                            from: accounts[2],
                            gas: 2000000
                        })
                    } catch (e) {
                        assert(isVmException(e), 'expected vm exception when not creator')
                    }
                })
            })
        })
    })
})

