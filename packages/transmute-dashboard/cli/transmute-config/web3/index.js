const Web3 = require('web3');

const web3Config = {
  providerUrl: 'http://localhost:8545'
};

const getWeb3 = async () => {
  let web3js;
  return new Promise(async (resolve, reject) => {
    if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
      web3js = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        `MetaMask not available, defaulting to ${web3Config.providerUrl}\n`
      );
      web3js = new Web3(
        new Web3.providers.HttpProvider(web3Config.providerUrl)
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

module.exports = {
  web3Config,
  getWeb3
};
