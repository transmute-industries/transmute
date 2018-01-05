module.exports = vorpal => {

  vorpal.command("accounts", "list accounts").action(async (args, callback) => {
     
      let d = require('transmute-framework')
      console.log('yolo...', d)
    // const accounts = await vorpal.T.getAccounts();
    // accounts.forEach(account => {
    //   vorpal.logger.log("📮  " + account);
    // });
    callback();
  });

  return vorpal;
};
