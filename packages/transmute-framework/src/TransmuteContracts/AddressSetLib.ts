import { BigNumber } from 'bignumber.js'
import { W3, SoltsiceContract } from 'soltsice'

/**
 * AddressSetLib API
 */
export class AddressSetLib extends SoltsiceContract {
  static get Artifacts() {
    return require('../contracts/AddressSetLib.json')
  }

  static get BytecodeHash() {
    // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
    let artifacts = AddressSetLib.Artifacts
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
  ): Promise<AddressSetLib> {
    let contract = new AddressSetLib(deploymentParams, ctorParams, w3, link)
    await contract._instancePromise
    return contract
  }

  static async At(address: string | object, w3?: W3): Promise<AddressSetLib> {
    let contract = new AddressSetLib(address, undefined, w3, undefined)
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
    super(w3, AddressSetLib.Artifacts, ctorParams ? [] : [], deploymentParams, link)
  }
  /*
        Contract methods
    */

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public size(self: any, txParams?: W3.TC.TxParams): Promise<BigNumber> {
    return new Promise((resolve, reject) => {
      this._instance.size
        .call(self, txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:member-ordering
  public add = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (self: any, value: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
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
      sendTransaction: (self: any, value: string, txParams?: W3.TC.TxParams): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.add
            .sendTransaction(self, value, txParams || this._sendParams)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (self: any, value: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.add.request(self, value).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (self: any, value: string): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.add.estimateGas(self, value).then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:member-ordering
  public remove = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (self: any, value: string, txParams?: W3.TC.TxParams): Promise<W3.TC.TransactionResult> => {
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
      sendTransaction: (self: any, value: string, txParams?: W3.TC.TxParams): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.remove
            .sendTransaction(self, value, txParams || this._sendParams)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (self: any, value: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.remove.request(self, value).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (self: any, value: string): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.remove.estimateGas(self, value).then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:member-ordering
  public set = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (
      self: any,
      index: BigNumber | number,
      value: string,
      txParams?: W3.TC.TxParams
    ): Promise<W3.TC.TransactionResult> => {
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
      sendTransaction: (
        self: any,
        index: BigNumber | number,
        value: string,
        txParams?: W3.TC.TxParams
      ): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.set
            .sendTransaction(self, index, value, txParams || this._sendParams)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (self: any, index: BigNumber | number, value: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.set.request(self, index, value).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (self: any, index: BigNumber | number, value: string): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.set.estimateGas(self, index, value).then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:member-ordering
  public replace = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (
      self: any,
      old: string,
      nu: string,
      txParams?: W3.TC.TxParams
    ): Promise<W3.TC.TransactionResult> => {
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
      sendTransaction: (
        self: any,
        old: string,
        nu: string,
        txParams?: W3.TC.TxParams
      ): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.replace
            .sendTransaction(self, old, nu, txParams || this._sendParams)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (self: any, old: string, nu: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.replace.request(self, old, nu).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (self: any, old: string, nu: string): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.replace.estimateGas(self, old, nu).then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public indexOf(self: any, value: string, txParams?: W3.TC.TxParams): Promise<BigNumber> {
    return new Promise((resolve, reject) => {
      this._instance.indexOf
        .call(self, value, txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public last(self: any, txParams?: W3.TC.TxParams): Promise<string> {
    return new Promise((resolve, reject) => {
      this._instance.last
        .call(self, txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public get(self: any, index: BigNumber | number, txParams?: W3.TC.TxParams): Promise<string> {
    return new Promise((resolve, reject) => {
      this._instance.get
        .call(self, index, txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public contains(self: any, value: string, txParams?: W3.TC.TxParams): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._instance.contains
        .call(self, value, txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public first(self: any, txParams?: W3.TC.TxParams): Promise<string> {
    return new Promise((resolve, reject) => {
      this._instance.first
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
      txParams?: W3.TC.TxParams
    ): Promise<W3.TC.TransactionResult> => {
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
      sendTransaction: (
        self: any,
        index: BigNumber | number,
        txParams?: W3.TC.TxParams
      ): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.pop
            .sendTransaction(self, index, txParams || this._sendParams)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
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
}
