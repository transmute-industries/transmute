import { BigNumber } from 'bignumber.js'
import { W3, SoltsiceContract } from 'soltsice'

/**
 * EventStore API
 */
export class EventStore extends SoltsiceContract {
  static get Artifacts() {
    return require('../../node_modules/transmute-contracts/build/contracts/EventStore.json')
  }

  static get BytecodeHash() {
    // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
    let artifacts = EventStore.Artifacts
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
  ): Promise<EventStore> {
    let contract = new EventStore(deploymentParams, ctorParams, w3, link)
    await contract._instancePromise
    return contract
  }

  static async At(address: string | object, w3?: W3): Promise<EventStore> {
    let contract = new EventStore(address, undefined, w3, undefined)
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
    super(w3, EventStore.Artifacts, ctorParams ? [] : [], deploymentParams, link)
  }
  /*
        Contract methods
    */

  // tslint:disable-next-line:member-ordering
  public writeEvent = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (
      _eventType: string,
      _keyType: string,
      _valueType: string,
      _key: string,
      _value: string,
      txParams?: W3.TC.TxParams
    ): Promise<W3.TC.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .writeEvent(_eventType, _keyType, _valueType, _key, _value, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: (
        _eventType: string,
        _keyType: string,
        _valueType: string,
        _key: string,
        _value: string,
        txParams?: W3.TC.TxParams
      ): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.writeEvent
            .sendTransaction(
              _eventType,
              _keyType,
              _valueType,
              _key,
              _value,
              txParams || this._sendParams
            )
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (
        _eventType: string,
        _keyType: string,
        _valueType: string,
        _key: string,
        _value: string
      ): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(
            this._instance.writeEvent.request(_eventType, _keyType, _valueType, _key, _value)
              .params[0].data
          )
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (
        _eventType: string,
        _keyType: string,
        _valueType: string,
        _key: string,
        _value: string
      ): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.writeEvent
            .estimateGas(_eventType, _keyType, _valueType, _key, _value)
            .then(g => resolve(g))
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

  // tslint:disable-next-line:member-ordering
  public destroy = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .destroy(txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: (txParams?: W3.TC.TxParams): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.destroy
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
          resolve(this._instance.destroy.request().params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.destroy.estimateGas().then(g => resolve(g))
        })
      }
    }
  )

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
  public getWhitelist(txParams?: W3.TC.TxParams): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this._instance.getWhitelist
        .call(txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

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
    (newOwner: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .transferOwnership(newOwner, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: (newOwner: string, txParams?: W3.TC.TxParams): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.transferOwnership
            .sendTransaction(newOwner, txParams || this._sendParams)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (newOwner: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.transferOwnership.request(newOwner).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (newOwner: string): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.transferOwnership.estimateGas(newOwner).then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:member-ordering
  public setWhitelist = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (_whitelist: string[], txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .setWhitelist(_whitelist, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: (_whitelist: string[], txParams?: W3.TC.TxParams): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.setWhitelist
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
          resolve(this._instance.setWhitelist.request(_whitelist).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (_whitelist: string[]): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.setWhitelist.estimateGas(_whitelist).then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:member-ordering
  public destroyAndSend = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (_recipient: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .destroyAndSend(_recipient, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: (_recipient: string, txParams?: W3.TC.TxParams): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.destroyAndSend
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
          resolve(this._instance.destroyAndSend.request(_recipient).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (_recipient: string): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.destroyAndSend.estimateGas(_recipient).then(g => resolve(g))
        })
      }
    }
  )
}
