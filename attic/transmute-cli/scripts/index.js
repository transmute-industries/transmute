const path = require("path");
const os = require("os");
const firebase = require("firebase");
require("firebase/firestore");

let TransmuteFramework = require("transmute-framework").default;
let contractArtifacts = {
  aca: require("transmute-framework/build/contracts/RBAC.json"),
  esa: require("transmute-framework/build/contracts/RBACEventStore.json"),
  esfa: require("transmute-framework/build/contracts/RBACEventStoreFactory.json")
};

module.exports = vorpal => {
  try {
    // const { TransmuteFramework, transmuteConfig } = require(path.join(
    //   process.cwd(),
    //   "./functions/.transmute/environment.web"
    // ));
    // vorpal.T = TransmuteFramework.init(transmuteConfig);
    throw "configuration has changed...";
  } catch (e) {
    vorpal.logger.warn(
      "No ./functions/.transmute/environment.web was detected."
    );

    try {
      const { transmuteProductionConfig } = require(path.join(
        os.homedir(),
        ".transmute/environment.web.js"
      ));
      const firebaseApp = firebase.initializeApp(
        require(path.join(
          os.homedir(),
          ".transmute/firebase-client-config.json"
        ))
      );
      const injectedConfig = Object.assign(
        transmuteProductionConfig,
        {
          firebaseApp
        },
        contractArtifacts
      );
      vorpal.T = TransmuteFramework.init(injectedConfig);
      vorpal.logger.info("Using ~/.transmute for env.");
    } catch (e) {
      vorpal.logger.warn(  "No ~/.transmute found. Please run:");
      vorpal.logger.info("transmute setup");
    }
  }

  vorpal.logger.log("👑  Transmute ");

  vorpal
    .command("version", "display version information")
    .action((args, callback) => {
      console.log("Transmute CLI: " + require("../package.json").version);
      console.log("Transmute Framework: " + TransmuteFramework.version);
      callback();
    });

  vorpal
    .command("echo [message]", "echo a message")
    .action((args, callback) => {
      const TransmuteCLI = require("./lib").default;
      TransmuteCLI.echo(args.message, callback);
    });

  vorpal.command("accounts", "list accounts").action(async (args, callback) => {
    const accounts = await vorpal.T.getAccounts();
    accounts.forEach(account => {
      vorpal.logger.log("📮  " + account);
    });
    callback();
  });

  require("./install")(vorpal);
  require("./setup")(vorpal);
  require("./init")(vorpal);
  require("./env")(vorpal);
  require("./env/migrate/transmute")(vorpal);
  require("./serve")(vorpal);
  require("./patch")(vorpal);
  require("./patch/secret-env")(vorpal);
  require("./truffle")(vorpal);
  require("./ipfs")(vorpal);
  require("./event-store")(vorpal);
  require("./ecrecover")(vorpal);
  require("./firebase")(vorpal);

  return vorpal;
};
