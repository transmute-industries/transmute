const Web3 = require('web3');

export const getWeb3RpcConnection = async () => {
  let web3js;
  return new Promise(async (resolve, reject) => {
    if (typeof window.web3 !== 'undefined') {
      web3js = new Web3(window.web3.currentProvider);
    } else {
      console.log('No web3? You should consider trying MetaMask!');
      web3js = new Web3(
        new Web3.providers.HttpProvider('http://localhost:8545')
      );
    }
    try {
      await web3js.eth.getAccounts();
      resolve(web3js);
    } catch (e) {
      reject(e);
    }
  });
};
