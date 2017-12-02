const vorpal = require("vorpal")();
const path = require("path");
const fse = require("fs-extra");
const fs = require("fs");

const T = require("./src/transmute");
const avatar = require("./lib");

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

vorpal
  .command("version", "display version information")
  .action((args, callback) => {
    console.log("Transmute PM: " + require("../package.json").version);
    callback();
  });

vorpal
  .command(
    "create",
    "create a package manager contract from the deployed factory."
  )
  .action(async (args, callback) => {
    if (!fs.existsSync("./src/PackageManager.ReadModel.json")) {
      let accounts = await T.getAccounts();
      let factory = await T.EventStoreFactoryContract.deployed();
      let { events, tx } = await T.Factory.createEventStore(
        factory,
        accounts[0]
      );
      let packageManger = await T.EventStoreContract.at(
        events[0].payload.address
      );
      let readModel = await avatar.list(T, packageManger, accounts[0]);
      await writeFile(
        path.join(process.cwd(), "./src/PackageManager.ReadModel.json"),
        JSON.stringify(readModel, null, 2)
      );
      console.log("created ./src/PackageManager.ReadModel.json");
    } else {
      console.warn(
        "./src/PackageManager.ReadModel.json already exists! Delete it, if you wish to create a new contract."
      );
    }
    callback();
  });

vorpal
  .command("publish", "publish this package to the package manager contract.")
  .action(async (args, callback) => {
    let accounts = await T.getAccounts();
    let contractAddress = require("./src/PackageManager.ReadModel.json")
      .contractAddress;
    let packageManger = await T.EventStoreContract.at(contractAddress);
    let readModel = await avatar.list(T, packageManger, accounts[0]);
    let latest = avatar.com.filterModelToLatest(readModel);

    let thisPackage = require("./package.json");

    if (
      Object.keys(latest).length === 0 ||
      latest[thisPackage.name].version < thisPackage.version
    ) {
      let fsaEvent = await avatar.publish(
        T,
        packageManger,
        accounts[0],
        process.cwd()
      );
      console.log(fsaEvent);
    } else {
      throw new Error("Package version already exists in smart contract");
    }
    callback();
  });

vorpal
  .command("list", "list the packages in this smart contract.")
  .action(async (args, callback) => {
    let accounts = await T.getAccounts();
    let contractAddress = require("./src/PackageManager.ReadModel.json")
      .contractAddress;
    let packageManger = await T.EventStoreContract.at(contractAddress);
    let readModel = await avatar.list(T, packageManger, accounts[0]);
    console.log(JSON.stringify(readModel, null, 2));
    callback();
  });

vorpal
  .command(
    "install [targetDirectory]",
    "install the latest versions of packages in this smart contract in the targetDirectory."
  )
  .action(async (args, callback) => {
    args.targetDirectory = args.targetDirectory;
    let accounts = await T.getAccounts();
    let contractAddress = require("./src/PackageManager.ReadModel.json")
      .contractAddress;
    let packageManger = await T.EventStoreContract.at(contractAddress);
    await avatar.install(T, packageManger, accounts[0], args.targetDirectory);
    console.log("install complete.");
    callback();
  });

vorpal
  .parse(process.argv)
  .delimiter("🦄   $")
  .show();
