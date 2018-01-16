import {
  W3,
  EventStore,
  Utils,
  EventStoreAdapter,
  IFSA,
  EventTransformer
} from '../transmute-framework'

export const GAS_COSTS = {
  WRITE_EVENT: 4000000
}

export namespace Store {
  /**
   * Store eventCount
   */
  export const eventCount = async (store: EventStore) => {
    let countBigNumber = await store.eventCount()
    return countBigNumber.toNumber()
  }

  /**
   * Store readFSA
   */
  export const readFSA = async (
    store: EventStore,
    eventStoreAdapter: EventStoreAdapter,
    web3: any,
    eventId: number
  ) => {
    // move this to eventStoreAdapter....
    let solidityValues: any = await store.readEvent(eventId)
    let esEvent = await EventTransformer.valuesToEsEvent(
      solidityValues[0],
      solidityValues[1],
      solidityValues[2],
      solidityValues[3],
      solidityValues[4],
      solidityValues[5],
      solidityValues[6],
      solidityValues[7],
      solidityValues[8]
    )
    return eventStoreAdapter.eventMap.EsEvent(esEvent)
  }

  /**
   * Store writeFSA
   */
  export const writeFSA = async (
    store: EventStore,
    eventStoreAdapter: EventStoreAdapter,
    web3: any,
    fromAddress: string,
    event: IFSA
  ): Promise<IFSA> => {
    if (typeof event.payload === 'string') {
      throw new Error('event.payload must be an object, not a string.')
    }

    if (Array.isArray(event.payload)) {
      throw new Error('event.payload must be an object, not an array.')
    }

    return eventStoreAdapter.writeFSA(store, fromAddress, event)
  }

  export const writeFSAs = async (
    store: EventStore,
    eventStoreAdapter: EventStoreAdapter,
    web3: any,
    fromAddress: string,
    events: IFSA[]
  ): Promise<IFSA[]> => {
    let writtenEvents: IFSA[] = []
    for (let i = 0; i < events.length; i++) {
      let event = events[i]
      writtenEvents.push(await writeFSA(store, eventStoreAdapter, web3, fromAddress, event))
    }
    return writtenEvents
  }

  export const readFSAs = async (
    store: EventStore,
    eventStoreAdapter: EventStoreAdapter,
    web3: any,
    eventIndex: number = 0
  ): Promise<IFSA[]> => {
    let endIndex: number = await eventCount(store)
    let events: IFSA[] = []
    for (let i: number = eventIndex; i < endIndex; i++) {
      events.push(await readFSA(store, eventStoreAdapter, web3, i))
    }
    return Promise.all(events)
  }
}
