import { getWeb3RpcConnection  } from '../../web3';

export const getWeb3Accounts = async () => {
  const web3 = await getWeb3RpcConnection();
  return web3.eth.getAccounts();
};
