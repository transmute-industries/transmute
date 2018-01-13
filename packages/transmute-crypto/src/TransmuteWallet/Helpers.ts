let bip39 = require('bip39')
const Wallet = require('ethereumjs-wallet')
const hdkey = require('ethereumjs-wallet/hdkey')

export const generateMnemonic = () => {
  return bip39.generateMnemonic()
}

export const getWalletFromMnemonic = (mnemonic: string) => {
  const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
  // Get the first account using the standard hd path.
  const walletHDPath = "m/44'/60'/0'/0/"
  const wallet = hdwallet.derivePath(walletHDPath + '0').getWallet()
  return wallet
}

export const getDefaultAddressFromWallet = (wallet: any) => {
  return '0x' + wallet.getAddress().toString('hex')
}

export const getDefaultAddressFromMnemonic = (mnemonic: string) => {
  return getDefaultAddressFromWallet(getWalletFromMnemonic(mnemonic))
}

export const getWalletFromPrivateKey = (unPrefixedPrivKeyHexString: string) => {
  return Wallet.fromPrivateKey(new Buffer(unPrefixedPrivKeyHexString, 'hex'))
}
