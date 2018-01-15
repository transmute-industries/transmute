import { W3 } from './transmute-framework'
import Web3 from 'web3'

// import { transmuteWeb3, ITransmuteWeb3Config } from "./web3";

import ProviderEngine from 'web3-provider-engine'
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc'
import WalletSubprovider from 'web3-provider-engine/subproviders/wallet'

export interface ITransmuteWeb3Config {
  providerUrl: string
  wallet?: any
}

class Relic {
  config: ITransmuteWeb3Config
  web3: any

  constructor(web3: any) {
    this.web3 = web3
  }

  getAccounts = (): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts((err, accounts) => {
        if (err) {
          reject(err)
        }
        resolve(accounts)
      })
    })
  }

  // async getAccounts(): Promise<string[]> {
  //   return new Promise((resolve, reject) => {
  //     (this.web3 as any).eth.getAccounts((err: any, accounts: string[]) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       resolve(accounts);
  //     });
  //   }) as Promise<string[]>;
  // }

  async getBalance(address: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ;(this.web3 as any).eth.getBalance(address, (err: any, balance: any) => {
        if (err) {
          reject(err)
        }
        resolve(parseInt(balance, 10))
      })
    }) as Promise<number>
  }

  async sendWei(fromAddress: string, toAddress, amountWei: number): Promise<string> {
    return new Promise((resolve, reject) => {
      ;(this.web3 as any).eth.sendTransaction(
        {
          from: fromAddress,
          to: toAddress,
          value: amountWei
        },
        (err: any, txhash: string) => {
          if (err) {
            reject(err)
          }
          resolve(txhash)
        }
      )
    }) as Promise<string>
  }
}

export default Relic
