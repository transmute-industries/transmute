#!/usr/bin/env node

const path = require("path");
const fse = require("fs-extra");
const fs = require("fs");
const Storage = require("node-storage");
const shell = require("shelljs");
const vorpal = require("vorpal")();

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

let nodeStorageAdapter = require("../transmute-adapter-node-storage");
const db = new Storage("./read_model_storage");
let nodeStorageDB = nodeStorageAdapter.getStorage();

vorpal
  .command("version", "display version information")
  .action((args, callback) => {
    console.log(
      "transmute-create-react-app:\t",
      require("./package.json").version
    );
    console.log(
      "transmute-framework:\t\t",
      require("transmute-framework/package.json").version
    );
    callback();
  });

vorpal
  .command("create", "create a Smart Contract ReadModel")
  .action(async (args, callback) => {
    console.log("creating..");

    if (!fs.existsSync("./src/EventStoreFactory.ReadModel.json")) {
      let T = require("transmute-framework");
      let relic = new T.Relic();
      let accounts = await relic.getAccounts();
      let factory = await T.Factory.create(relic.web3, accounts[0]);
      const readModelAdapter = {
        getItem: id => {
          return JSON.parse(db.get(id));
        },
        setItem: (id, value) => {
          return db.put(id, JSON.stringify(value));
        }
      };
      const eventStoreAdapter = new T.EventStoreAdapter({
        N: {
          keyName: "sha1",
          adapter: nodeStorageAdapter,
          db: nodeStorageDB,
          readIDFromBytes32: bytes32 => {
            return T.Utils.toAscii(bytes32).replace(/\u0000/g, "");
          },
          writeIDToBytes32: id => {
            return id;
          }
        }
      });
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
        relic.web3,
        accounts[0]
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

vorpal
  .parse(process.argv)
  .delimiter("🦄   $")
  .show();
