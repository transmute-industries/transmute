const path = require("path");
const fse = require("fs-extra");
const fs = require("fs");
const shell = require("shelljs");

const T = require("transmute-framework");
const transmute = require("../transmute");

const writeFile = (path, data) => {
  return new Promise((resolve, reject) => {
    fse.outputFile(path, data, err => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};

module.exports = vorpal => {
  vorpal
    .command("create", "create a Smart Contract ReadModel")
    .action(async (args, callback) => {
      console.log("creating..");

      if (!fs.existsSync("./src/EventStoreFactory.ReadModel.json")) {
        let {
          relic,
          accounts,
          eventStoreAdapter,
          readModelAdapter
        } = await transmute();

        let factory = await T.Factory.create(relic.web3, accounts[0]);

        let factorReadModel = await T.Factory.getReadModel(
          factory,
          eventStoreAdapter,
          readModelAdapter,
          relic.web3,
          accounts[0]
        );

        let eventStore = await T.Factory.createStore(
          factory,
          accounts,
          eventStoreAdapter,
          relic.web3,
          accounts[0]
        );
        // console.log(eventStore);

        // The Factory ReadModel automatically tracks eventstores!
        let changes = await factorReadModel.sync(
          factory,
          eventStoreAdapter,
          relic.web3
        );
        console.log("factory changes detected! ", changes);

        await writeFile(
          path.join(process.cwd(), "./src/EventStoreFactory.ReadModel.json"),
          JSON.stringify(factorReadModel.state, null, 2)
        );
        console.log("created ./src/EventStoreFactory.ReadModel.json");
      } else {
        console.warn(
          "./src/EventStoreFactory.ReadModel.json already exists! Delete it, if you wish to create a new contract."
        );
        let cmd = "rm -rf ./src/EventStoreFactory.ReadModel.json";
        if (shell.exec(cmd).code !== 0) {
          shell.echo("Error: Failed to reset demo.");
          shell.exit(1);
        }
      }
      callback();
    });

  return vorpal;
};
