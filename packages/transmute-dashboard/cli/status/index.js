const transmute = require('../transmute-config');

module.exports = vorpal => {
  vorpal
    .command('status', 'list out network connections')
    .types({ string: ['_'] })
    .action(async (args, callback) => {
      console.log('HELLO', transmute.ipfs);

      let web3 = await transmute.web3.getWeb3();
      let accounts = await web3.eth.getAccounts();

      // console.log(web3);
      console.log(
        JSON.stringify(
          {
            accounts,
            ipfs: transmute.ipfs.ipfsConfig,
            web3: transmute.web3.web3Config
          },
          null,
          2
        )
      );

      

      //   const web3 = getWeb3();
      //   const relic = new T.Relic(web3);
      //   const accounts = await relic.getAccounts();
      //   const tx = await relic.sendWei(accounts[0], args.address, args.amountWei);
      //   vorpal.logger.info(tx);
      //   let balance = await web3.eth.getBalance(args.address);
      //   vorpal.logger.log('\nAddress: ' + args.address);
      //   vorpal.logger.log('\nBalance: ' + balance + '\n');
      callback();
    });
  return vorpal;
};
