import { BigNumber } from 'bignumber.js'
import { W3, SoltsiceContract } from 'soltsice'

/**
 * Migrations API
 */
export class Migrations extends SoltsiceContract {
  public static get Artifacts() {
    return require('../contracts/Migrations.json')
  }

  public static get BytecodeHash() {
    // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
    let artifacts = Migrations.Artifacts
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
  ): Promise<Migrations> {
    w3 = w3 || W3.Default
    if (!privateKey) {
      let contract = new Migrations(deploymentParams, ctorParams, w3, link)
      await contract._instancePromise
      return contract
    } else {
      let data = Migrations.NewData(ctorParams, w3)
      let txHash = await w3.sendSignedTransaction(
        W3.zeroAddress,
        privateKey,
        data,
        deploymentParams
      )
      let txReceipt = await w3.waitTransactionReceipt(txHash)
      let rawAddress = txReceipt.contractAddress
      let contract = await Migrations.At(rawAddress, w3)
      return contract
    }
  }

  public static async At(
    address: string | object,
    w3?: W3
  ): Promise<Migrations> {
    let contract = new Migrations(address, undefined, w3, undefined)
    await contract._instancePromise
    return contract
  }

  public static async Deployed(w3?: W3): Promise<Migrations> {
    let contract = new Migrations('', undefined, w3, undefined)
    await contract._instancePromise
    return contract
  }

  // tslint:disable-next-line:max-line-length
  public static NewData(ctorParams?: {}, w3?: W3): string {
    // tslint:disable-next-line:max-line-length
    let data = SoltsiceContract.NewDataImpl(
      w3,
      Migrations.Artifacts,
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
      Migrations.Artifacts,
      ctorParams ? [] : [],
      deploymentParams,
      link
    )
  }
  /*
        Contract methods
    */

  // tslint:disable-next-line:member-ordering
  public upgrade = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (
      new_address: string,
      txParams?: W3.TX.TxParams
    ): Promise<W3.TX.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .upgrade(new_address, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: Object.assign(
        (new_address: string, txParams?: W3.TX.TxParams): Promise<string> => {
          return new Promise((resolve, reject) => {
            this._instance.upgrade
              .sendTransaction(new_address, txParams || this._sendParams)
              .then(res => resolve(res))
              .catch(err => reject(err))
          })
        },
        {
          // tslint:disable-next-line:max-line-length
          // tslint:disable-next-line:variable-name
          sendSigned: (
            new_address: string,
            privateKey: string,
            txParams?: W3.TX.TxParams,
            nonce?: number
          ): Promise<string> => {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(
              this.address,
              privateKey,
              this._instance.upgrade.request(new_address).params[0].data,
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
      data: (new_address: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.upgrade.request(new_address).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (new_address: string): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.upgrade.estimateGas(new_address).then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public last_completed_migration(
    txParams?: W3.TX.TxParams
  ): Promise<BigNumber> {
    return new Promise((resolve, reject) => {
      this._instance.last_completed_migration
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

  // tslint:disable-next-line:member-ordering
  public setCompleted = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (
      completed: BigNumber | number,
      txParams?: W3.TX.TxParams
    ): Promise<W3.TX.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .setCompleted(completed, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: Object.assign(
        (
          completed: BigNumber | number,
          txParams?: W3.TX.TxParams
        ): Promise<string> => {
          return new Promise((resolve, reject) => {
            this._instance.setCompleted
              .sendTransaction(completed, txParams || this._sendParams)
              .then(res => resolve(res))
              .catch(err => reject(err))
          })
        },
        {
          // tslint:disable-next-line:max-line-length
          // tslint:disable-next-line:variable-name
          sendSigned: (
            completed: BigNumber | number,
            privateKey: string,
            txParams?: W3.TX.TxParams,
            nonce?: number
          ): Promise<string> => {
            // tslint:disable-next-line:max-line-length
            return this.w3.sendSignedTransaction(
              this.address,
              privateKey,
              this._instance.setCompleted.request(completed).params[0].data,
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
      data: (completed: BigNumber | number): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.setCompleted.request(completed).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (completed: BigNumber | number): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.setCompleted
            .estimateGas(completed)
            .then(g => resolve(g))
        })
      }
    }
  )
}
