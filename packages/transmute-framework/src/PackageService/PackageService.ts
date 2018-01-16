import {
  Relic,
  Store,
  EventStoreAdapter,
  PackageManager,
  W3,
  IFSA,
  IReadModelState,
  ReadModel
} from '../transmute-framework'

import R from './Reducer'

export default class PackageService {
  constructor(
    public relic: Relic,
    public packageManager: PackageManager,
    public eventStoreAdapter: EventStoreAdapter
  ) {
    // console.log("created...");
  }

  publishEvent = async (event: IFSA, fromAddress: string) => {
    return await Store.writeFSA(
      this.packageManager,
      this.eventStoreAdapter,
      this.relic.web3,
      fromAddress,
      event
    )
  }

  getReadModel = async readModelAdapter => {
    let state: IReadModelState = JSON.parse(JSON.stringify(R.initialState))

    state.contractAddress = this.packageManager.address
    state.readModelStoreKey = `${state.readModelType}:${state.contractAddress}`

    let ipfsReadModel = new ReadModel(readModelAdapter, R.reducer, state)
    let changes = await ipfsReadModel.sync(
      this.packageManager,
      this.eventStoreAdapter,
      this.relic.web3
    )
    console.log(JSON.stringify(ipfsReadModel, null, 2))
  }
}
