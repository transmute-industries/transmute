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

    let getStat = mhash => {
      return new Promise((resolve, reject) => {
        this.eventStoreAdapter.mapper.I.db.stat(mhash, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
    }

    // const updateAdapterMeta = async (state, action: any) => {

    // let eventMultihash = action.meta.adapterPayload.value;
    // let eventStat: any = await getStat(eventMultihash);
    // let newCumulativeEventSize =
    //   state.model.adapterMeta[action.meta.valueType].cumulativeEventSize +
    //   eventStat.CumulativeSize;
    // // console.log("some adapter events have hashs inside.. count them too");
    // let packageStat: any = await getStat(action.payload.multihash);
    // let newCumulativePacakgeSize =
    //   state.model.adapterMeta[action.meta.valueType].cumulativePackageSize +
    //   packageStat.CumulativeSize;

    // TERRIBLE TERRIBLE !!!!!! TERRIBLE
    // storing all event refs in the read model is totally unacceptable for anything,
    // except maybe a package manager...
    // if (state.model.adapterMeta[action.meta.valueType].allRefs.indexOf(eventMultihash) === -1) {
    //   state.model.adapterMeta[action.meta.valueType].allRefs.push(eventMultihash);
    // }
    // if (
    //   state.model.adapterMeta[action.meta.valueType].allRefs.indexOf(action.payload.multihash) ===
    //   -1
    // ) {
    //   state.model.adapterMeta[action.meta.valueType].allRefs.push(action.payload.multihash);
    // }

    // return {
    //   ...state.model.adapterMeta,
    //   [action.meta.valueType]: {
    //     ...state.model.adapterMeta[action.meta.valueType],
    //     cumulativeEventSize: newCumulativeEventSize,
    //     cumulativePackageSize: newCumulativePacakgeSize
    //   }
    // };
    // };

    const getAdapterMetaFromEvent = async (action: IFSA) => {
      let eventMultihash = action.meta.adapterPayload.value
      let eventStat: any = await getStat(eventMultihash)
      let packageStat: any = await getStat(action.payload.multihash)
      return {
        eventHash: eventMultihash,
        eventSize: eventStat.CumulativeSize,
        packageHash: action.payload.multihash,
        pacakgeSize: packageStat.CumulativeSize
      }
    }

    let interceptorChain = [
      async (event: IFSA) => {
        if (event.type === 'PACKAGE_UPDATED') {
          event.meta.adapterMeta = await getAdapterMetaFromEvent(event)
        }
        return event
      }
    ]

    let ipfsReadModel = new ReadModel(readModelAdapter, R.reducer, state, interceptorChain)
    let changes = await ipfsReadModel.sync(
      this.packageManager,
      this.eventStoreAdapter,
      this.relic.web3
    )
    console.log(JSON.stringify(ipfsReadModel, null, 2))
  }
}
