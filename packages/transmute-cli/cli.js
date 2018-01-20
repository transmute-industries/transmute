#!/usr/bin/env node
const vorpalLog = require("vorpal-log");
const vorpal = require("vorpal")();
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const ethereumjsWallet = require("ethereumjs-wallet");
const Web3 = require("web3");
const ProviderEngine = require("web3-provider-engine");
const RpcSubprovider = require("web3-provider-engine/subproviders/rpc");
const WalletSubprovider = require("web3-provider-engine/subproviders/wallet");

vorpal.use(vorpalLog);

const T = require("transmute-framework");
const TC = require("transmute-crypto");
const TransmuteIpfs = require("transmute-ipfs");

const { init } = require("./transmute");

const RPC_HOST = "http://localhost:8545";

// vorpal
//   .command('foo <requiredArg> [optionalArg]')
//   .option('-v, --verbose', 'Print foobar instead.')
//   .description('Outputs "bar".')
//   .alias('foosball')
//   .action(function(args, callback) {
//     if (args.options.verbose) {
//       this.log('foobar');
//     } else {
//       this.log('bar');
//     }
//     callback();
//   });

const getWeb3 = account => {
  const engine = new ProviderEngine();

  if (account) {
    var wallet = ethereumjsWallet.fromPrivateKey(
      new Buffer(account.privateKey.replace("0x", ""), "hex")
    );
    engine.addProvider(new WalletSubprovider(wallet, {}));
  }

  engine.addProvider(
    new RpcSubprovider({
      rpcUrl: RPC_HOST
    })
  );
  engine.start();
  let web3 = new Web3(engine);
  return web3;
};

const writeFile = async (filePath, fileData) => {
  return new Promise((resolve, reject) => {
    fse.outputFile(filePath, fileData, err => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};

const writeAccountToDisk = async () => {
  const web3 = getWeb3();
  let data = web3.eth.accounts.create(web3.utils.randomHex(32));
  let account = web3.eth.accounts.create(web3.utils.randomHex(32));
  let encryptedAccount = account.encrypt(args.password);
  await writeFile("./encryptedAccount", encryptedAccount);
  console.log("./encryptedAccount written to disk.");
};

const getEncryptedAccount = async () => {
  return new Promise((resolve, reject) => {
    fse.readFile("./encryptedAccount", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
};

const getDecryptedAccount = async password => {
  const web3 = new Web3();
  const encryptedAccount = await getEncryptedAccount();
  return web3.eth.accounts.decrypt(encryptedAccount, password);
};

vorpal
  .command("init <password>", "setup a cli account to use for deployments.")
  .option("-F, --force", "OVERWRITES YOUR ACCOUNT.")
  .action(async (args, callback) => {
    if (fs.existsSync("./encryptedAccount") && !args.options.force) {
      vorpal.logger.warn("Account already exists.");
      vorpal.logger.log("\nTo reset use: tranmsute init <new-password> -F\n");
    } else {
      await writeAccountToDisk();
    }

    callback();
  });

vorpal
  .command("address", "get your transmute address")
  .action(async (args, callback) => {
    if (!fs.existsSync("./encryptedAccount")) {
      vorpal.logger.error("No account found.");
      vorpal.logger.info("To create an account use: tranmsute init ");
    } else {
      let web3 = getWeb3();
      let encryptedAccount = await getEncryptedAccount();
      vorpal.logger.log("Your address is: \n\n0x" + encryptedAccount.address);
      let balance = await web3.eth.getBalance("0x" + encryptedAccount.address);
      vorpal.logger.log("\nYour balance is: " + balance + "\n");
    }
    callback();
  });

vorpal
  .command("fund <address> <amountWei>", "fund an address")
  .types({ string: ["_"] })
  .action(async (args, callback) => {
    const web3 = getWeb3();
    const relic = new T.Relic(web3);
    const accounts = await relic.getAccounts();
    const tx = await relic.sendWei(accounts[0], args.address, args.amountWei);
    vorpal.logger.info(tx);
    let balance = await web3.eth.getBalance(args.address);
    vorpal.logger.log("\nAddress: 0x" + args.address);
    vorpal.logger.log("\nBalance: " + balance + "\n");
    callback();
  });

vorpal
  .command("create-factory <password>", "create a factory.")
  .option("-F, --force", "OVERWRITES YOUR READ MODEL")
  .types({ string: ["_"] })
  .action(async (args, callback) => {
    const setup = await init();
    const { eventStoreAdapter, readModelAdapter } = setup;
    if (
      fs.existsSync("./EventStoreFactory.ReadModel.json") &&
      !args.options.force
    ) {
      vorpal.logger.warn("EventStoreFactory.ReadModel.json already exists.");
      vorpal.logger.log(
        "\nTo reset use: tranmsute create-factory <new-password> -F\n"
      );
    } else {
      const decryptedAccount = await getDecryptedAccount(args.password);
      const web3 = getWeb3(decryptedAccount);
      const relic = new T.Relic(web3);
      const accounts = await relic.getAccounts();
      try {
        const factory = await T.Factory.create(
          relic.web3,
          accounts[0].toLowerCase()
        );
        const factoryReadModel = await T.Factory.getReadModel(
          factory,
          eventStoreAdapter,
          readModelAdapter,
          relic.web3,
          accounts[0]
        );
        await writeFile(
          "./EventStoreFactory.ReadModel.json",
          JSON.stringify(factoryReadModel.state, null, 2)
        );
        vorpal.logger.log(
          "\n./EventStoreFactory.ReadModel.json written to disk.\n"
        );
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
    callback();
  });

vorpal
  .command("create-store <password>", "create a store.")
  .option("-F, --force", "OVERWRITES YOUR READ MODEL")
  .types({ string: ["_"] })
  .action(async (args, callback) => {
    const setup = await init();
    const {
      // relic,
      // accounts,
      eventStoreAdapter,
      readModelAdapter
    } = setup;
    if (!fs.existsSync("./EventStoreFactory.ReadModel.json")) {
      vorpal.logger.error(
        "./EventStoreFactory.ReadModel.json does not exist.\n"
      );
      vorpal.logger.info("You must run: transmute create-factory <password>\n");
      callback();
    } else {
      if (
        fs.existsSync("./PackageManager.ReadModel.json") &&
        !args.options.force
      ) {
        vorpal.logger.warn("PackageManager.ReadModel.json already exists.");
        vorpal.logger.log(
          "\nTo reset use: tranmsute create-store <new-password> -F\n"
        );
      } else {
        const decryptedAccount = await getDecryptedAccount(args.password);
        const web3 = getWeb3(decryptedAccount);
        const relic = new T.Relic(web3);
        const accounts = await relic.getAccounts();
        try {
          let factoryReadModelJson = require("./EventStoreFactory.ReadModel.json");
          const factory = await T.EventStoreFactory.At(
            factoryReadModelJson.contractAddress
          );
          let whitelist = accounts.map(acc => {
            return T.Utils.toChecksumAddress(acc);
          });
          let store = await T.Factory.createStore(
            factory,
            whitelist,
            relic.web3,
            accounts[0].toLowerCase()
          );
          // console.log(store);
          let ps = new T.PackageService(relic, store, eventStoreAdapter);
          let psReadModel = await ps.getReadModel(readModelAdapter);
          // console.log(psReadModel);
          await writeFile(
            "./PackageManager.ReadModel.json",
            JSON.stringify(psReadModel.state, null, 2)
          );
          vorpal.logger.log(
            "\n./PackageManager.ReadModel.json written to disk.\n"
          );
        } catch (e) {
          console.log(e);
          throw e;
        }
      }
    }
    callback();
  });

vorpal
  .command(
    "publish-package <password> <targetPath>",
    "publishes a directory to ipfs with an store event."
  )
  .types({ string: ["_"] })
  .action(async (args, callback) => {
    if (!fs.existsSync("./PackageManager.ReadModel.json")) {
      vorpal.logger.log("\n");
      vorpal.logger.error("./PackageManager.ReadModel.json does not exist.\n");
      vorpal.logger.info("run: transmute create-store <password>\n");
      return callback();
    }
    const pmReadModelJson = require("./PackageManager.ReadModel.json");
    let packageJsonTargetPath = path.join(
      "./",
      args.targetPath,
      "package.json"
    );
    let fileExists = fs.existsSync(packageJsonTargetPath);
    let dirPackageJson = require("./" + packageJsonTargetPath);
    if (!fileExists) {
      vorpal.logger.log("\n");
      vorpal.logger.error("targePath does not contain package.json\n");
      return callback();
    }

    const setup = await init();
    const { eventStoreAdapter, readModelAdapter } = setup;
    let TI = new TransmuteIpfs();
    const decryptedAccount = await getDecryptedAccount(args.password);
    const web3 = getWeb3(decryptedAccount);
    const relic = new T.Relic(web3);
    const accounts = await relic.getAccounts();
    const ignorelist = await TI.getIgnoreList();
    // console.log(ignorelist)
    let results = await TI.addDirectory(args.targetPath, ignorelist);
    // console.log(results)
    let dirHash = results.pop().hash;
    // console.log(dirHash)

    let store = await T.EventStore.At(pmReadModelJson.contractAddress);
    let ps = new T.PackageService(relic, store, eventStoreAdapter);

    let events = await ps.publishPackage(
      dirHash,
      dirPackageJson.name,
      accounts[0].toLowerCase()
    );
    vorpal.logger.log(JSON.stringify(events, null, 2));
    let psReadModel = await ps.getReadModel(readModelAdapter);
    await writeFile(
      "./PackageManager.ReadModel.json",
      JSON.stringify(psReadModel.state, null, 2)
    );
    vorpal.logger.log("\n./PackageManager.ReadModel.json written to disk.\n");
  });

  vorpal
  .command(
    "delete-package <password> <packageHash>",
    "publishes a delete event to the store, it may take some time for IPFS to stop serving the package."
  )
  .types({ string: ["_"] })
  .action(async (args, callback) => {
    if (!fs.existsSync("./PackageManager.ReadModel.json")) {
      vorpal.logger.log("\n");
      vorpal.logger.error("./PackageManager.ReadModel.json does not exist.\n");
      vorpal.logger.info("run: transmute create-store <password>\n");
      return callback();
    }
    const pmReadModelJson = require("./PackageManager.ReadModel.json");

    if (!pmReadModelJson.model[args.packageHash]){
      vorpal.logger.log("\n");
      vorpal.logger.error(`${args.packageHash} does not exist in ./PackageManager.ReadModel.json\n`);
      return callback();
    }

    const setup = await init();
    const { eventStoreAdapter, readModelAdapter } = setup;

    const decryptedAccount = await getDecryptedAccount(args.password);
    const web3 = getWeb3(decryptedAccount);
    const relic = new T.Relic(web3);
    const accounts = await relic.getAccounts();

    let store = await T.EventStore.At(pmReadModelJson.contractAddress);
    let ps = new T.PackageService(relic, store, eventStoreAdapter);

    let events = await ps.deletePackage(args.packageHash, accounts[0].toLowerCase())
    
    // let readModel = await ps.getReadModel(readModelAdapter);
    // // console.log(readModel.state)
    // await writeFile(
    //   "./PackageManager.ReadModel.json",
    //   JSON.stringify(readModel.state, null, 2)
    // );
    // vorpal.logger.log("\n./PackageManager.ReadModel.json written to disk.\n");
  })

vorpal
  .parse(process.argv)
  .delimiter("🦄   $")
  .show();
