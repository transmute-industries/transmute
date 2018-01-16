import { W3 } from './transmute-framework'

class Relic {
  web3: W3
  W3 = W3

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
