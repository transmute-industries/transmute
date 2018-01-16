import {
  W3,
  EventTransformer,
  Store,
  EventStoreFactory,
  EventStore,
  EventStoreAdapter,
  ReadModel,
  IReadModelState,
  IReadModelAdapter,
  IReadModel
} from '../transmute-framework'

import Reducer from './Reducer'

export namespace Factory {
  /**
   * Factory create
   */
  export const create = async (web3: any, fromAddress: string): Promise<EventStoreFactory> => {
    W3.Default = web3
    const instance = await EventStoreFactory.New(W3.TC.txParamsDefaultDeploy(fromAddress), {
      _multisig: fromAddress
    })
    return instance
  }

  /**
   * Factory createStore
   */
  export const createStore = async (
    factory: EventStoreFactory,
    whitelist: string[],
    adapter: EventStoreAdapter,
    web3: any,
    fromAddress: string
  ) => {
    W3.Default = web3
    const receipt = await factory.createEventStore(
      whitelist,
      W3.TC.txParamsDefaultDeploy(fromAddress)
    )
    const events = await adapter.extractEventsFromLogs(receipt.logs)
    let factoryEvents = EventTransformer.filterEventsByMeta(events, 'msgSender', fromAddress)
    return EventStore.At(factoryEvents[0].payload.value)
  }

  export const getEventStores = async (factory: EventStoreFactory, fromAddress: string) => {
    let addresses = await factory.getEventStores(W3.TC.txParamsDefaultDeploy(fromAddress))
    return addresses
  }

  /**
   * Factory getReadModel
   */
  export const getReadModel = async (
    factory: EventStoreFactory,
    adapter: EventStoreAdapter,
    readModelAdapter: IReadModelAdapter,
    web3: any,
    fromAddress: string
  ) => {
    let state: IReadModelState = JSON.parse(JSON.stringify(Reducer.initialState))

    state.contractAddress = factory.address
    state.readModelStoreKey = `${state.readModelType}:${state.contractAddress}`

    let factoryReadModel = new ReadModel(readModelAdapter, Reducer.reducer, state)

    let changes = await factoryReadModel.sync(factory as any, adapter, web3)

    return factoryReadModel
  }
}
