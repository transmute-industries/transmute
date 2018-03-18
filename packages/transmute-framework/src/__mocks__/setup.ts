import { getDefaultRelic } from './getRelic'
import { getDefaultEventStoreAdapter } from './getEventStoreAdapter'
import { getDefaultReadModelAdapter } from './getReadModelAdapter'

import { W3 } from 'soltsice'
import {
  Relic,
  TransmuteContracts,
  EventStoreAdapter,
  Factory,
  Store,
  EventStore,
  EventStoreFactory
} from '../transmute-framework'

export const getSetupAsync = async () => {
  const relic = getDefaultRelic()
  const eventStoreAdapter = getDefaultEventStoreAdapter()
  const readModelAdapter = getDefaultReadModelAdapter()

  const accounts = await relic.getAccounts()
  const factory = await Factory.create(relic.web3, accounts[0])
  const store = await Factory.createStore(factory, accounts.slice(0, 5), relic.web3, accounts[0])

  return {
    relic,
    eventStoreAdapter,
    readModelAdapter,
    accounts,
    factory,
    store
  }
}
