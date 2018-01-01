export interface ITransmuteFrameworkConfig {
  providerUrl: string
  TRANSMUTE_API_ROOT: any
  aca: any
  esa: any
  esfa: any
  ipfsConfig?: any
  wallet?: any
  firebaseApp?: any
  firebaseAdmin?: any
}

export const PRODUCTION = {
  providerUrl: 'https://testrpc.azurewebsites.net',
  ipfsConfig: {
    host: 'ipfs.infura.io',
    port: '5001',
    options: {
      protocol: 'https',
    },
  },
  TRANSMUTE_API_ROOT: 'https://us-central1-transmute-framework.cloudfunctions.net',
}

export const DEVELOPMENT = {
  providerUrl: 'http://localhost:8545',
  ipfsConfig: {
    host: 'localhost',
    port: '5001',
    options: {
      protocol: 'http',
    },
  },
  TRANSMUTE_API_ROOT: 'http://localhost:3001',
}
