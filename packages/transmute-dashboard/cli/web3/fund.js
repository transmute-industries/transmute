const transmute = require('../transmute-config');
const T = require('transmute-framework');

module.exports = vorpal => {
  vorpal
    .command(
      'fund <address> <amountWei>',
      'fund an address from the default account.'
    )
    .types({ string: ['_'] })
    .action(async (args, callback) => {
      let web3 = await transmute.web3.getWeb3();
      const relic = new T.Relic(web3);
      const accounts = await relic.getAccounts();
      const tx = await relic.sendWei(accounts[0], args.address, args.amountWei);
      vorpal.logger.info(tx);
      let balance = await web3.eth.getBalance(args.address);
      vorpal.logger.log('\nAddress: ' + args.address);
      vorpal.logger.log('\nBalance: ' + balance + '\n');
      callback();
    });
  return vorpal;
};
