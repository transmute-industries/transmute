import { BigNumber } from 'bignumber.js'
import { W3, SoltsiceContract } from 'soltsice'

/**
 * UIntSetLib API
 */
export class UIntSetLib extends SoltsiceContract {
  public static get Artifacts() {
    return require('../contracts/UIntSetLib.json')
  }

  public static get BytecodeHash() {
    // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
    let artifacts = UIntSetLib.Artifacts
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
  ): Promise<UIntSetLib> {
    w3 = w3 || W3.Default
    if (!privateKey) {
      let contract = new UIntSetLib(deploymentParams, ctorParams, w3, link)
      await contract._instancePromise
      return contract
    } else {
      let data = UIntSetLib.NewData(ctorParams, w3)
      let txHash = await w3.sendSignedTransaction(
        W3.zeroAddress,
        privateKey,
        data,
        deploymentParams
      )
      let txReceipt = await w3.waitTransactionReceipt(txHash)
      let rawAddress = txReceipt.contractAddress
      let contract = await UIntSetLib.At(rawAddress, w3)
      return contract
    }
  }

  public static async At(
    address: string | object,
    w3?: W3
  ): Promise<UIntSetLib> {
    let contract = new UIntSetLib(address, undefined, w3, undefined)
    await contract._instancePromise
    return contract
  }

  public static async Deployed(w3?: W3): Promise<UIntSetLib> {
    let contract = new UIntSetLib('', undefined, w3, undefined)
    await contract._instancePromise
    return contract
  }

  // tslint:disable-next-line:max-line-length
  public static NewData(ctorParams?: {}, w3?: W3): string {
    // tslint:disable-next-line:max-line-length
    let data = SoltsiceContract.NewDataImpl(
      w3,
      UIntSetLib.Artifacts,
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
      UIntSetLib.Artifacts,
      ctorParams ? [] : [],
      deploymentParams,
      link
    )
  }
  /*
        Contract methods
    */

  // tslint:disable-next-line:member-ordering
  public replace = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (
      self: any,
      old: BigNumber | number,
      nu: BigNumber | number,
      txParams?: W3.TX.TxParams
    ): Promise<W3.TX.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .replace(self, old, nu, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: Object.assign(
        (
          self: any,
          old: BigNumber | number,
          nu: BigNumber | number,
          txParams?: W3.TX.TxParams
        ): Promise<string> => {
          return new Promise((resolve, reject) => {
            this._instance.replace
              .sendTransaction(self, old, nu, txParams || this._sendParams)
              .then(res => resolve(res))
              .catch(err => reject(err))
          })
        },
        {
          // tslint:disable-next-line:max-line-length
          // tslint:disable-next-line:variable-name
          sendSigned: (
            self: any,
            old: BigNumber | number,
            nu: BigNumber | number,
            privateKey: string,
            txParams?: W3.TX.TxParams,
            nonce?: number
          ): Promise<string> => {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(
              this.address,
              privateKey,
              this._instance.replace.request(self, old, nu).params[0].data,
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
      data: (
        self: any,
        old: BigNumber | number,
        nu: BigNumber | number
      ): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.replace.request(self, old, nu).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (
        self: any,
        old: BigNumber | number,
        nu: BigNumber | number
      ): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.replace
            .estimateGas(self, old, nu)
            .then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:member-ordering
  public add = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (
      self: any,
      value: BigNumber | number,
      txParams?: W3.TX.TxParams
    ): Promise<W3.TX.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .add(self, value, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: Object.assign(
        (
          self: any,
          value: BigNumber | number,
          txParams?: W3.TX.TxParams
        ): Promise<string> => {
          return new Promise((resolve, reject) => {
            this._instance.add
              .sendTransaction(self, value, txParams || this._sendParams)
              .then(res => resolve(res))
              .catch(err => reject(err))
          })
        },
        {
          // tslint:disable-next-line:max-line-length
          // tslint:disable-next-line:variable-name
          sendSigned: (
            self: any,
            value: BigNumber | number,
            privateKey: string,
            txParams?: W3.TX.TxParams,
            nonce?: number
          ): Promise<string> => {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(
              this.address,
              privateKey,
              this._instance.add.request(self, value).params[0].data,
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
      data: (self: any, value: BigNumber | number): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.add.request(self, value).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (self: any, value: BigNumber | number): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.add.estimateGas(self, value).then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public indexOf(
    self: any,
    value: BigNumber | number,
    txParams?: W3.TX.TxParams
  ): Promise<BigNumber> {
    return new Promise((resolve, reject) => {
      this._instance.indexOf
        .call(self, value, txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:member-ordering
  public remove = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (
      self: any,
      value: BigNumber | number,
      txParams?: W3.TX.TxParams
    ): Promise<W3.TX.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .remove(self, value, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: Object.assign(
        (
          self: any,
          value: BigNumber | number,
          txParams?: W3.TX.TxParams
        ): Promise<string> => {
          return new Promise((resolve, reject) => {
            this._instance.remove
              .sendTransaction(self, value, txParams || this._sendParams)
              .then(res => resolve(res))
              .catch(err => reject(err))
          })
        },
        {
          // tslint:disable-next-line:max-line-length
          // tslint:disable-next-line:variable-name
          sendSigned: (
            self: any,
            value: BigNumber | number,
            privateKey: string,
            txParams?: W3.TX.TxParams,
            nonce?: number
          ): Promise<string> => {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(
              this.address,
              privateKey,
              this._instance.remove.request(self, value).params[0].data,
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
      data: (self: any, value: BigNumber | number): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.remove.request(self, value).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (self: any, value: BigNumber | number): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.remove.estimateGas(self, value).then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public contains(
    self: any,
    value: BigNumber | number,
    txParams?: W3.TX.TxParams
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._instance.contains
        .call(self, value, txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public size(self: any, txParams?: W3.TX.TxParams): Promise<BigNumber> {
    return new Promise((resolve, reject) => {
      this._instance.size
        .call(self, txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public get(
    self: any,
    index: BigNumber | number,
    txParams?: W3.TX.TxParams
  ): Promise<BigNumber> {
    return new Promise((resolve, reject) => {
      this._instance.get
        .call(self, index, txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public last(self: any, txParams?: W3.TX.TxParams): Promise<BigNumber> {
    return new Promise((resolve, reject) => {
      this._instance.last
        .call(self, txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:member-ordering
  public pop = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (
      self: any,
      index: BigNumber | number,
      txParams?: W3.TX.TxParams
    ): Promise<W3.TX.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .pop(self, index, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: Object.assign(
        (
          self: any,
          index: BigNumber | number,
          txParams?: W3.TX.TxParams
        ): Promise<string> => {
          return new Promise((resolve, reject) => {
            this._instance.pop
              .sendTransaction(self, index, txParams || this._sendParams)
              .then(res => resolve(res))
              .catch(err => reject(err))
          })
        },
        {
          // tslint:disable-next-line:max-line-length
          // tslint:disable-next-line:variable-name
          sendSigned: (
            self: any,
            index: BigNumber | number,
            privateKey: string,
            txParams?: W3.TX.TxParams,
            nonce?: number
          ): Promise<string> => {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(
              this.address,
              privateKey,
              this._instance.pop.request(self, index).params[0].data,
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
      data: (self: any, index: BigNumber | number): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.pop.request(self, index).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (self: any, index: BigNumber | number): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.pop.estimateGas(self, index).then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public first(self: any, txParams?: W3.TX.TxParams): Promise<BigNumber> {
    return new Promise((resolve, reject) => {
      this._instance.first
        .call(self, txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:member-ordering
  public set = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (
      self: any,
      index: BigNumber | number,
      value: BigNumber | number,
      txParams?: W3.TX.TxParams
    ): Promise<W3.TX.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .set(self, index, value, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: Object.assign(
        (
          self: any,
          index: BigNumber | number,
          value: BigNumber | number,
          txParams?: W3.TX.TxParams
        ): Promise<string> => {
          return new Promise((resolve, reject) => {
            this._instance.set
              .sendTransaction(self, index, value, txParams || this._sendParams)
              .then(res => resolve(res))
              .catch(err => reject(err))
          })
        },
        {
          // tslint:disable-next-line:max-line-length
          // tslint:disable-next-line:variable-name
          sendSigned: (
            self: any,
            index: BigNumber | number,
            value: BigNumber | number,
            privateKey: string,
            txParams?: W3.TX.TxParams,
            nonce?: number
          ): Promise<string> => {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(
              this.address,
              privateKey,
              this._instance.set.request(self, index, value).params[0].data,
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
      data: (
        self: any,
        index: BigNumber | number,
        value: BigNumber | number
      ): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.set.request(self, index, value).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (
        self: any,
        index: BigNumber | number,
        value: BigNumber | number
      ): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.set
            .estimateGas(self, index, value)
            .then(g => resolve(g))
        })
      }
    }
  );
}
