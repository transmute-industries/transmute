// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import { W3 } from 'soltsice'
import { BigNumber } from 'bignumber.js'
import { transmuteWeb3, ITransmuteWeb3Config } from './web3'
export { Factory } from './Factory'
export { Store } from './Store'

export default class Relic {
  web3: W3

  constructor(config: ITransmuteWeb3Config) {
    this.web3 = transmuteWeb3(config, false)
  }

  async getAccounts(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts((err: any, accounts: string[]) => {
        if (err) {
          reject(err)
        }
        resolve(accounts)
      })
    }) as Promise<string[]>
  }

  async getBalance(address: string): Promise<number> {
    let balance: any = await this.web3.eth.getBalance(address)
    return balance.toNumber()
  }
}
