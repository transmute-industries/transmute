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

const MAPPER_ENCODING = 'I'

export default class PackageService {
  constructor(
    public relic: Relic,
    public packageManager: PackageManager,
    public eventStoreAdapter: EventStoreAdapter
  ) {
    // console.log("created...");
  }

  publishPackage = async (multihash: string, name: string, fromAddress: string) => {
    return await Store.writeFSA(
      this.packageManager,
      this.eventStoreAdapter,
      this.relic.web3,
      fromAddress,
      {
        type: 'PACKAGE_UPDATED',
        payload: {
          name,
          multihash
        },
        meta: {
          adapter: MAPPER_ENCODING
        }
      }
    )
  }

  deletePackage = async (multihash: string, fromAddress: string) => {
    return await Store.writeFSA(
      this.packageManager,
      this.eventStoreAdapter,
      this.relic.web3,
      fromAddress,
      {
        type: 'PACKAGE_DELETED',
        payload: {
          multihash
        },
        meta: {
          adapter: MAPPER_ENCODING
        }
      }
    )
  }

  getReadModel = async readModelAdapter => {
    let state: IReadModelState = JSON.parse(JSON.stringify(R.initialState))
    state.contractAddress = this.packageManager.address
    state.readModelStoreKey = `${state.readModelType}:${state.contractAddress}`

    // this needs to be made a generic supported method
    // for package manager to be extended beyond ipfs
    let getStat = mhash => {
      return new Promise((resolve, reject) => {
        this.eventStoreAdapter.mapper[MAPPER_ENCODING].db.stat(mhash, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
    }

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
      },
      async (event: IFSA) => {
        if (event.type === 'PACKAGE_DELETED') {
          event.meta.adapterMeta = await getAdapterMetaFromEvent(event)
          event.meta.updateAdapterMeta = true
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
    // console.log(JSON.stringify(ipfsReadModel, null, 2))
    return ipfsReadModel
  }
}
