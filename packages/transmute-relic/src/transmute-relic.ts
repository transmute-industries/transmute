// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import { transmuteWeb3, ITransmuteWeb3Config } from './web3'
// import { EventStore } from "./EventStore";

export { Factory } from './Factory'
export { Store } from './Store'

export default class Relic {
  web3: any

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
}
