import { BigNumber } from 'bignumber.js'
import { W3, SoltsiceContract } from 'soltsice'

/**
 * EventStoreFactory API
 */
export class EventStoreFactory extends SoltsiceContract {
  static get Artifacts() {
    return require('../contracts/EventStoreFactory.json')
  }

  static get BytecodeHash() {
    // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
    let artifacts = EventStoreFactory.Artifacts
    if (!artifacts || !artifacts.bytecode) {
      return undefined
    }
    let hash = W3.sha3(JSON.stringify(artifacts.bytecode))
    return hash
  }

  // tslint:disable-next-line:max-line-length
  static async New(
    deploymentParams: W3.TC.TxParams,
    ctorParams?: {},
    w3?: W3,
    link?: SoltsiceContract[]
  ): Promise<EventStoreFactory> {
    let contract = new EventStoreFactory(deploymentParams, ctorParams, w3, link)
    await contract._instancePromise
    return contract
  }

  static async At(address: string | object, w3?: W3): Promise<EventStoreFactory> {
    let contract = new EventStoreFactory(address, undefined, w3, undefined)
    await contract._instancePromise
    return contract
  }

  protected constructor(
    deploymentParams: string | W3.TC.TxParams | object,
    ctorParams?: {},
    w3?: W3,
    link?: SoltsiceContract[]
  ) {
    // tslint:disable-next-line:max-line-length
    super(w3, EventStoreFactory.Artifacts, ctorParams ? [] : [], deploymentParams, link)
  }
  /*
        Contract methods
    */

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public getInternalEventTypes(txParams?: W3.TC.TxParams): Promise<string> {
    return new Promise((resolve, reject) => {
      this._instance.getInternalEventTypes
        .call(txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:member-ordering
  public recycle = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .recycle(txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: (txParams?: W3.TC.TxParams): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.recycle
            .sendTransaction(txParams || this._sendParams)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.recycle.request().params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.recycle.estimateGas().then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public eventCount(txParams?: W3.TC.TxParams): Promise<BigNumber> {
    return new Promise((resolve, reject) => {
      this._instance.eventCount
        .call(txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public owner(txParams?: W3.TC.TxParams): Promise<string> {
    return new Promise((resolve, reject) => {
      this._instance.owner
        .call(txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public getEventStores(txParams?: W3.TC.TxParams): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this._instance.getEventStores
        .call(txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:member-ordering
  public recycleAndSend = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (_recipient: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .recycleAndSend(_recipient, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: (_recipient: string, txParams?: W3.TC.TxParams): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.recycleAndSend
            .sendTransaction(_recipient, txParams || this._sendParams)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (_recipient: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.recycleAndSend.request(_recipient).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (_recipient: string): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.recycleAndSend.estimateGas(_recipient).then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public readEvent(_eventId: BigNumber | number, txParams?: W3.TC.TxParams): Promise<any> {
    return new Promise((resolve, reject) => {
      this._instance.readEvent
        .call(_eventId, txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:member-ordering
  public transferOwnership = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (_newOwner: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .transferOwnership(_newOwner, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: (_newOwner: string, txParams?: W3.TC.TxParams): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.transferOwnership
            .sendTransaction(_newOwner, txParams || this._sendParams)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (_newOwner: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.transferOwnership.request(_newOwner).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (_newOwner: string): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.transferOwnership.estimateGas(_newOwner).then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:member-ordering
  public createEventStore = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (_whitelist: string[], txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .createEventStore(_whitelist, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: (_whitelist: string[], txParams?: W3.TC.TxParams): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.createEventStore
            .sendTransaction(_whitelist, txParams || this._sendParams)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (_whitelist: string[]): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.createEventStore.request(_whitelist).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (_whitelist: string[]): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.createEventStore.estimateGas(_whitelist).then(g => resolve(g))
        })
      }
    }
  )
}
