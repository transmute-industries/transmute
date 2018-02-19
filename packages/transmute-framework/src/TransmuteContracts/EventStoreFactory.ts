import { BigNumber } from 'bignumber.js'
import { W3, SoltsiceContract } from 'soltsice'

/**
 * EventStoreFactory API
 */
export class EventStoreFactory extends SoltsiceContract {
  public static get Artifacts() {
    return require('../contracts/EventStoreFactory.json')
  }

  public static get BytecodeHash() {
    // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
    let artifacts = EventStoreFactory.Artifacts
    if (!artifacts || !artifacts.bytecode) {
      return undefined
    }
    let hash = W3.sha3(JSON.stringify(artifacts.bytecode))
    return hash
  }

  // tslint:disable-next-line:max-line-length
  public static async New(
    deploymentParams: W3.TX.TxParams,
    ctorParams?: {},
    w3?: W3,
    link?: SoltsiceContract[],
    privateKey?: string
  ): Promise<EventStoreFactory> {
    w3 = w3 || W3.Default
    if (!privateKey) {
      let contract = new EventStoreFactory(
        deploymentParams,
        ctorParams,
        w3,
        link
      )
      await contract._instancePromise
      return contract
    } else {
      let data = EventStoreFactory.NewData(ctorParams, w3)
      let txHash = await w3.sendSignedTransaction(
        W3.zeroAddress,
        privateKey,
        data,
        deploymentParams
      )
      let txReceipt = await w3.waitTransactionReceipt(txHash)
      let rawAddress = txReceipt.contractAddress
      let contract = await EventStoreFactory.At(rawAddress, w3)
      return contract
    }
  }

  public static async At(
    address: string | object,
    w3?: W3
  ): Promise<EventStoreFactory> {
    let contract = new EventStoreFactory(address, undefined, w3, undefined)
    await contract._instancePromise
    return contract
  }

  public static async Deployed(w3?: W3): Promise<EventStoreFactory> {
    let contract = new EventStoreFactory('', undefined, w3, undefined)
    await contract._instancePromise
    return contract
  }

  // tslint:disable-next-line:max-line-length
  public static NewData(ctorParams?: {}, w3?: W3): string {
    // tslint:disable-next-line:max-line-length
    let data = SoltsiceContract.NewDataImpl(
      w3,
      EventStoreFactory.Artifacts,
      ctorParams ? [] : []
    )
    return data
  }

  protected constructor(
    deploymentParams: string | W3.TX.TxParams | object,
    ctorParams?: {},
    w3?: W3,
    link?: SoltsiceContract[]
  ) {
    // tslint:disable-next-line:max-line-length
    super(
      w3,
      EventStoreFactory.Artifacts,
      ctorParams ? [] : [],
      deploymentParams,
      link
    )
  }
  /*
        Contract methods
    */

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public getInternalEventTypes(txParams?: W3.TX.TxParams): Promise<string[]> {
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
    (txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
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
      sendTransaction: Object.assign(
        (txParams?: W3.TX.TxParams): Promise<string> => {
          return new Promise((resolve, reject) => {
            this._instance.recycle
              .sendTransaction(txParams || this._sendParams)
              .then(res => resolve(res))
              .catch(err => reject(err))
          })
        },
        {
          // tslint:disable-next-line:max-line-length
          // tslint:disable-next-line:variable-name
          sendSigned: (
            privateKey: string,
            txParams?: W3.TX.TxParams,
            nonce?: number
          ): Promise<string> => {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(
              this.address,
              privateKey,
              this._instance.recycle.request().params[0].data,
              txParams,
              nonce
            )
          }
        }
      )
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
  public eventCount(txParams?: W3.TX.TxParams): Promise<BigNumber> {
    return new Promise((resolve, reject) => {
      this._instance.eventCount
        .call(txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public owner(txParams?: W3.TX.TxParams): Promise<string> {
    return new Promise((resolve, reject) => {
      this._instance.owner
        .call(txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public getEventStores(txParams?: W3.TX.TxParams): Promise<string[]> {
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
    (
      _recipient: string,
      txParams?: W3.TX.TxParams
    ): Promise<W3.TX.TransactionResult> => {
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
      sendTransaction: Object.assign(
        (_recipient: string, txParams?: W3.TX.TxParams): Promise<string> => {
          return new Promise((resolve, reject) => {
            this._instance.recycleAndSend
              .sendTransaction(_recipient, txParams || this._sendParams)
              .then(res => resolve(res))
              .catch(err => reject(err))
          })
        },
        {
          // tslint:disable-next-line:max-line-length
          // tslint:disable-next-line:variable-name
          sendSigned: (
            _recipient: string,
            privateKey: string,
            txParams?: W3.TX.TxParams,
            nonce?: number
          ): Promise<string> => {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(
              this.address,
              privateKey,
              this._instance.recycleAndSend.request(_recipient).params[0].data,
              txParams,
              nonce
            )
          }
        }
      )
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (_recipient: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(
            this._instance.recycleAndSend.request(_recipient).params[0].data
          )
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (_recipient: string): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.recycleAndSend
            .estimateGas(_recipient)
            .then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public readEvent(
    _eventId: BigNumber | number,
    txParams?: W3.TX.TxParams
  ): Promise<any> {
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
    (
      _newOwner: string,
      txParams?: W3.TX.TxParams
    ): Promise<W3.TX.TransactionResult> => {
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
      sendTransaction: Object.assign(
        (_newOwner: string, txParams?: W3.TX.TxParams): Promise<string> => {
          return new Promise((resolve, reject) => {
            this._instance.transferOwnership
              .sendTransaction(_newOwner, txParams || this._sendParams)
              .then(res => resolve(res))
              .catch(err => reject(err))
          })
        },
        {
          // tslint:disable-next-line:max-line-length
          // tslint:disable-next-line:variable-name
          sendSigned: (
            _newOwner: string,
            privateKey: string,
            txParams?: W3.TX.TxParams,
            nonce?: number
          ): Promise<string> => {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(
              this.address,
              privateKey,
              this._instance.transferOwnership.request(_newOwner).params[0]
                .data,
              txParams,
              nonce
            )
          }
        }
      )
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (_newOwner: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(
            this._instance.transferOwnership.request(_newOwner).params[0].data
          )
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (_newOwner: string): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.transferOwnership
            .estimateGas(_newOwner)
            .then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:member-ordering
  public createEventStore = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (
      _whitelist: string[],
      txParams?: W3.TX.TxParams
    ): Promise<W3.TX.TransactionResult> => {
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
      sendTransaction: Object.assign(
        (_whitelist: string[], txParams?: W3.TX.TxParams): Promise<string> => {
          return new Promise((resolve, reject) => {
            this._instance.createEventStore
              .sendTransaction(_whitelist, txParams || this._sendParams)
              .then(res => resolve(res))
              .catch(err => reject(err))
          })
        },
        {
          // tslint:disable-next-line:max-line-length
          // tslint:disable-next-line:variable-name
          sendSigned: (
            _whitelist: string[],
            privateKey: string,
            txParams?: W3.TX.TxParams,
            nonce?: number
          ): Promise<string> => {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(
              this.address,
              privateKey,
              this._instance.createEventStore.request(_whitelist).params[0]
                .data,
              txParams,
              nonce
            )
          }
        }
      )
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (_whitelist: string[]): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(
            this._instance.createEventStore.request(_whitelist).params[0].data
          )
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (_whitelist: string[]): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.createEventStore
            .estimateGas(_whitelist)
            .then(g => resolve(g))
        })
      }
    }
  )
}
