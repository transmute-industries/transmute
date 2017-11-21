var Web3 = require('web3')
var UnsafeEventStoreFactory = artifacts.require('./TransmuteFramework/EventStore/Bases/UnsafeEventStore/UnsafeEventStoreFactory.sol')
var UnsafeEventStore = artifacts.require('./TransmuteFramework/EventStore/Bases/UnsafeEventStore/UnsafeEventStore.sol')

var _ = require('lodash')

const {
    getFSAFromEventArgs,
    getFSAFromEventValues,
} = require('../../../Common')

describe('', () => {

    contract('UnsafeEventStoreFactory', function (accounts) {

        var factory = null
        var account1EventStoreAddresses = []
        var account2EventStoreAddresses = []
        var eventStoreAddresses = []

        it('deployed', async () => {
            factory = await UnsafeEventStoreFactory.deployed()
            let owner = await factory.owner()
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
            let esc = await UnsafeEventStore.at(escAddresss)
            let escOwner = await esc.creator()
            assert.equal(escOwner, accounts[0], 'expect factory caller to be es contract owner.')

            eventStoreAddresses.push(escAddresss)
            account1EventStoreAddresses.push(escAddresss)

            // Create secondEventStore
            _tx = await factory.createEventStore({ from: accounts[2], gas: 2000000 })
            event = _tx.logs[0].args
            fsa = getFSAFromEventArgs(event)
            assert.equal(fsa.type, 'ES_CREATED', 'expect first event to be Type ES_CREATED')
    
            escAddresss = fsa.payload.address
            esc = await UnsafeEventStore.at(escAddresss)
            escOwner = await esc.creator()
            assert.equal(escOwner, accounts[2], 'expect factory caller to be es contract owner.')

            eventStoreAddresses.push(escAddresss)
            account2EventStoreAddresses.push(escAddresss)

        })

        it('getEventStores', async () => {
          let _addresses = await factory.getEventStores()
          assert(_.difference(eventStoreAddresses, _addresses).length === 0, 'Expect eventStoreAddresses to equal _addresses')
        })

        it('getEventStoresByCreator', async () => {
          let _account1EventStoreAddresses = await factory.getEventStoresByCreator.call({ from: accounts[1] })
          assert(_.difference(_account1EventStoreAddresses, account1EventStoreAddresses).length === 0, 'Expect _account1EventStoreAddresses to equal account1EventStoreAddresses')

          let _account2EventStoreAddresses = await factory.getEventStoresByCreator.call({ from: accounts[2] })
          assert(_.difference(_account2EventStoreAddresses, account2EventStoreAddresses).length === 0, 'Expect _account2EventStoreAddresses to equal account2EventStoreAddresses')

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
    })
})

