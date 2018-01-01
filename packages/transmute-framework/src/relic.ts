import { W3 } from './transmute-framework'
import { transmuteWeb3, ITransmuteWeb3Config } from './web3'

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
