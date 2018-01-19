

module.exports = vorpal => {
  vorpal
    .command("init", "setup a cli account to use for deployments.")
    .action(async (args, callback) => {

   

      // console.log('yolo...', T)
      // const accounts = await vorpal.T.getAccounts();
      // accounts.forEach(account => {
      //   vorpal.logger.log("📮  " + account);
      // });
      callback();
    });

  return vorpal;
};
