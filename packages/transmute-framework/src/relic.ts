import { W3 } from "./transmute-framework";
import { transmuteWeb3, ITransmuteWeb3Config } from "./web3";

export default class Relic {
  web3: W3;

  constructor(config: ITransmuteWeb3Config) {
    this.web3 = transmuteWeb3(config);
  }

  async getAccounts(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      (this.web3 as any).eth.getAccounts((err: any, accounts: string[]) => {
        if (err) {
          reject(err);
        }
        resolve(accounts);
      });
    }) as Promise<string[]>;
  }

  async getBalance(address: string): Promise<number> {
    return new Promise((resolve, reject) => {
      (this.web3 as any).eth.getBalance(address, (err: any, balance: any) => {
        if (err) {
          reject(err);
        }
        resolve(balance.toNumber());
      });
    }) as Promise<number>;
  }

  async sendWei(fromAddress: string, toAddress, amountWei: number): Promise<string> {
    return new Promise((resolve, reject) => {
      (this.web3 as any).eth.sendTransaction(
        {
          from: fromAddress,
          to: toAddress,
          value: amountWei
        },
        (err: any, txhash: string) => {
          if (err) {
            reject(err);
          }
          resolve(txhash);
        }
      );
    }) as Promise<string>;
  }
}
