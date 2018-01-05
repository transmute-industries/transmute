
module.exports = vorpal => {
  vorpal.logger.log("👑  Transmute ");
  
  vorpal
    .command("version", "display version information")
    .action((args, callback) => {
      console.log("Transmute CLI: " + require("../package.json").version);
      console.log(
        "Transmute Framework: " +
          require("../package.json").dependencies["transmute-framework"]
      );
      callback();
    });

  require("./tour")(vorpal);
  require("./web3")(vorpal);

  // require("./install")(vorpal);
  // require("./setup")(vorpal);
  // require("./init")(vorpal);
  // require("./env")(vorpal);
  // require("./env/migrate/transmute")(vorpal);
  // require("./serve")(vorpal);
  // require("./patch")(vorpal);
  // require("./patch/secret-env")(vorpal);
  // require("./truffle")(vorpal);
  // require("./ipfs")(vorpal);
  // require("./event-store")(vorpal);
  // require("./ecrecover")(vorpal);
  // require("./firebase")(vorpal);

  return vorpal;
};
