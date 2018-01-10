import { W3, SoltsiceContract } from 'soltsice'

/**
 * Destructible API
 */
export class Destructible extends SoltsiceContract {
  static get Artifacts() {
    return require('../contracts/Destructible.json')
  }

  static get BytecodeHash() {
    // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
    let artifacts = Destructible.Artifacts
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
  ): Promise<Destructible> {
    let contract = new Destructible(deploymentParams, ctorParams, w3, link)
    await contract._instancePromise
    return contract
  }

  static async At(address: string | object, w3?: W3): Promise<Destructible> {
    let contract = new Destructible(address, undefined, w3, undefined)
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
    super(w3, Destructible.Artifacts, ctorParams ? [] : [], deploymentParams, link)
  }
  /*
        Contract methods
    */

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
