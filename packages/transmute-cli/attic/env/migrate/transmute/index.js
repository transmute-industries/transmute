const shell = require("shelljs");

module.exports = vorpal => {
  vorpal
    .command("migrate", "migrate a dapp with truffle and firebase.")
    .action((args, callback) => {
      let command =
        "transmute mig-env firebase transmute ~/.transmute/environment.secret.env";
      if (shell.exec(command).code !== 0) {
        vorpal.logger.fatal("Error: failed to migrate firbase env.");
        vorpal.logger.fatal(command);
        shell.exit(1);
      }

      // command = "truffle migrate --network azure";
      // if (shell.exec(command).code !== 0) {
      //   vorpal.logger.fatal("Error: failed to truffle migrate.");
      //   vorpal.logger.fatal(command);
      //   shell.exit(1);
      // }

      command = "firebase deploy --only functions";
      if (shell.exec(command).code !== 0) {
        vorpal.logger.fatal("Error: failed to migrate firbase functions.");
        vorpal.logger.fatal(command);
        shell.exit(1);
      }

      callback();
    });

  //   vorpal.command("migrate", "run truffle migrate").action((args, callback) => {
  //     console.log("🍄  Truffle Migrate ...");
  //     if (shell.exec("truffle migrate").code !== 0) {
  //       shell.echo("Error: truffle migrate failed.");
  //       shell.exit(1);
  //     }
  //     callback();
  //   });

  return vorpal;
};
