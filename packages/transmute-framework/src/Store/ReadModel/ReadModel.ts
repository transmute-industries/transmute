import {
  W3,
  IFSA,
  Store,
  IReadModel,
  IReadModelAdapter,
  IReadModelState,
  EventStoreAdapter,
  EventStore
} from '../../transmute-framework'

const STATE_REQUIRED_PROPS = ['contractAddress', 'readModelType', 'readModelStoreKey']

export class ReadModel implements IReadModel {
  constructor(
    public readModelAdapter: IReadModelAdapter,
    public reducer: any,
    public state: IReadModelState
  ) {
    if (readModelAdapter.getItem === undefined) {
      throw new Error(
        'readModelAdapter.getItem is not defined. readModelAdapter must implement IReadModelAdapter'
      )
    }

    if (reducer === undefined) {
      throw new Error('reducer is not defined. pass a reducer to the constructor.')
    }

    if (state === undefined) {
      throw new Error('state is not defined. pass a default state to the constructor.')
    }

    this.requireStateToHaveDefaultProperties(state)
  }

  requireStateToHaveDefaultProperties = (state: IReadModelState | any) => {
    STATE_REQUIRED_PROPS.forEach(prop => {
      if (
        state[prop] === undefined ||
        state[prop] === '' ||
        state[prop] === '0x0000000000000000000000000000000000000000'
      ) {
        throw new Error(
          `state.${prop} is not defined. make sure its defined before creating a read model.`
        )
      }
    })

    if (state.readModelStoreKey !== `${state.readModelType}:${state.contractAddress}`) {
      throw new Error(
        `state.readModelStoreKey is not formatted correctly. it should be ${state.readModelType}:${
          state.contractAddress
        }`
      )
    }
  }

  applyEvents = (events: IFSA[]) => {
    events.forEach((event: IFSA) => {
      this.state = this.reducer(this.state, event)
    })
  }

  sync = async (
    store: EventStore,
    readModelAdapter: EventStoreAdapter,
    web3: W3,
    fromAddress: string
  ) => {
    let changes = false
    try {
      this.state = await this.readModelAdapter.getItem(this.state.readModelStoreKey)
    } catch (e) {
      // this case when we have not persisted a read model before OR
      // there is a bug is getItem/setItem....
      changes = true
    }
    let startIndex = this.state.lastEvent !== null ? this.state.lastEvent + 1 : 0
    let events = await Store.readFSAs(store, readModelAdapter, web3, fromAddress, startIndex)
    changes = changes || events.length > 0
    if (changes) {
      this.applyEvents(events)
      this.readModelAdapter.setItem(this.state.readModelStoreKey, this.state)
    }
    return changes
  }
}
