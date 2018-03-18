import { W3 } from 'soltsice'
import {
  Relic,
  Store,
  EventStoreAdapter,
  IReadModelAdapter,
  PackageManager,
  IFSA,
  IReadModelState,
  ReadModel,
  IReadModel
} from '../transmute-framework'

import R from './Reducer'

const MAPPER_ENCODING = 'I'

export default class PackageService {
  readModel: ReadModel

  constructor(
    public relic: Relic,
    public packageManager: PackageManager,
    public eventStoreAdapter: EventStoreAdapter,
    public readModelAdapter: IReadModelAdapter
  ) {
    // console.log("created...");
    this.readModel = undefined as any
  }

  requireLatestReadModel = async () => {
    this.readModel = await this.getReadModel()

    // if (!this.readModel) {
    //   this.readModel = await this.getReadModel();
    // } else {
    //   this.readModel.sync(this.packageManager, this.eventStoreAdapter, this.relic.web3);
    // }
  }

  publishPackage = async (multihash: string, name: string, fromAddress: string) => {
    // await this.requireLatestReadModel()

    // if (this.readModel.state.model[multihash]) {
    //   throw new Error('package already exists in read model.')
    // }

    const events = await Store.writeFSA(
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

    await this.requireLatestReadModel()

    return events
  }

  deletePackage = async (multihash: string, fromAddress: string) => {
    await this.requireLatestReadModel()

    if (!this.readModel.state.model[multihash]) {
      throw new Error('package does not exist in read model.')
    }

    const event = await Store.writeFSA(
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

    await this.requireLatestReadModel()

    return event
  }

  getReadModel = async () => {
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
        packageSize: packageStat.CumulativeSize
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

    if (!this.readModel) {
      this.readModel = new ReadModel(this.readModelAdapter, R.reducer, state, interceptorChain)
    }

    let changes = await this.readModel.sync(
      this.packageManager,
      this.eventStoreAdapter,
      this.relic.web3
    )
    // console.log(JSON.stringify(ipfsReadModel, null, 2))
    return this.readModel
  }
}
