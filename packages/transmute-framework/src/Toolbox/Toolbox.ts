import { ITransmuteFramework } from '../transmute-framework'

import * as util from 'ethereumjs-util'

const bip39 = require('bip39')
const hdkey = require('ethereumjs-wallet/hdkey')

import * as Com from './ECRecover/Common'

export interface ISignatureWithMeta {
  messageBuffer: Buffer
  messageBufferHex: string
  messageHex: string
  signature: string
  address: string
  isPrefixed: boolean
}
export class Toolbox {
  constructor(public framework: ITransmuteFramework) {}

  public sign = async (address: string, message: string): Promise<ISignatureWithMeta> => {
    return await Com.getMessageSignatureWithMeta(this.framework.web3, address, message)
  }

  public recover = async (messageBufferHex: string, signature: string): Promise<string> => {
    const messageBuffer = Buffer.from(messageBufferHex.substring(2), 'hex')
    return await Com.recoverAddressFromSig(messageBuffer, signature)
  }

  public generateMnemonic = () => {
    return bip39.generateMnemonic()
  }

  public getWalletFromMnemonic = (mnemonic: string) => {
    const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
    // Get the first account using the standard hd path.
    const walletHDPath = "m/44'/60'/0'/0/"
    const wallet = hdwallet.derivePath(walletHDPath + '0').getWallet()
    return wallet
  }

  public getDefaultAddressFromWallet = (wallet: any) => {
    return '0x' + wallet.getAddress().toString('hex')
  }

  public getDefaultAddressFromMnemonic = (mnemonic: string) => {
    return this.getDefaultAddressFromWallet(this.getWalletFromMnemonic(mnemonic))
  }
}
