const vorpal = require('vorpal')();
const vorpalLog = require('vorpal-log');
const vorpalTour = require('vorpal-tour');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const Web3 = require('web3');
const ethereumjsWallet = require('ethereumjs-wallet');
const ProviderEngine = require('web3-provider-engine');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc');
const WalletSubprovider = require('web3-provider-engine/subproviders/wallet');
const T = require('transmute-framework');


vorpal.use(vorpalLog);

require('./status')(vorpal);
require('./web3')(vorpal);
require('./publish')(vorpal);

// const RPC_HOST = "http://localhost:8545";

// const getWeb3 = account => {
//   const engine = new ProviderEngine();

//   if (account) {
//     var wallet = ethereumjsWallet.fromPrivateKey(
//       new Buffer(account.privateKey.replace("0x", ""), "hex")
//     );
//     engine.addProvider(new WalletSubprovider(wallet, {}));
//   }

//   engine.addProvider(
//     new RpcSubprovider({
//       rpcUrl: RPC_HOST
//     })
//   );
//   engine.start();
//   let web3 = new Web3(engine);
//   return web3;
// };

// const writeFile = async (filePath, fileData) => {
//   return new Promise((resolve, reject) => {
//     fse.outputFile(filePath, fileData, err => {
//       if (err) {
//         reject(err);
//       }
//       resolve(true);
//     });
//   });
// };

// const getEncryptedAccount = async () => {
//   return new Promise((resolve, reject) => {
//     fse.readFile("./encryptedAccount.json", (err, data) => {
//       if (err) {
//         reject(err);
//       }
//       resolve(JSON.parse(data));
//     });
//   });
// };

// const getDecryptedAccount = async password => {
//   const web3 = new Web3();
//   const encryptedAccount = await getEncryptedAccount();
//   return web3.eth.accounts.decrypt(encryptedAccount, password);
// };

vorpal
  .command('version', 'display version information')
  .action(async (args, callback) => {
    console.log('transmute-dashboard:\t', require('../package.json').version);
    console.log(
      'transmute-framework:\t',
      require('transmute-framework/package.json').version
    );
    callback();
  });

// vorpal
//   .command(
//     "create-web3-account <password>",
//     "create an encrypted web3 account."
//   )
//   .option("-F, --force", "OVERWRITES YOUR ACCOUNT.")
//   .action(async (args, callback) => {
//     const writeAccountToDisk = async () => {
//       const web3 = getWeb3();
//       let data = web3.eth.accounts.create(web3.utils.randomHex(32));
//       let account = web3.eth.accounts.create(web3.utils.randomHex(32));
//       let encryptedAccount = account.encrypt(args.password);
//       await writeFile(
//         "./encryptedAccount.json",
//         JSON.stringify(encryptedAccount, null, 2)
//       );
//       console.log("./encryptedAccount.json written to disk.");
//     };

//     if (fs.existsSync("./encryptedAccount.json") && !args.options.force) {
//       vorpal.logger.warn("Account already exists.");
//       vorpal.logger.log(
//         "\nTo reset use: tranmsute create-web3-account <new-password> -F\n"
//       );
//     } else {
//       await writeAccountToDisk();
//     }

//     callback();
//   });

// vorpal
//   .command("address", "show the address and balance of ./encryptedAccount.json")
//   .action(async (args, callback) => {
//     if (!fs.existsSync("./encryptedAccount.json")) {
//       vorpal.logger.error("No account found.");
//       vorpal.logger.info(
//         "To create an account use: create-web3-account <password> "
//       );
//     } else {
//       let web3 = getWeb3();
//       let encryptedAccount = await getEncryptedAccount();
//       vorpal.logger.log("Your address is: \n\n0x" + encryptedAccount.address);
//       let balance = await web3.eth.getBalance("0x" + encryptedAccount.address);
//       vorpal.logger.log("\nYour balance is: " + balance + "\n");
//     }
//     callback();
//   });

// const { init } = require("./src/transmute/index");

// vorpal
//   .command("create-factory <password>", "create a factory.")
//   .option("-F, --force", "OVERWRITES YOUR READ MODEL")
//   .types({ string: ["_"] })
//   .action(async (args, callback) => {
//     const setup = await init();
//     const { eventStoreAdapter, readModelAdapter } = setup;
//     if (
//       fs.existsSync("./src/EventStoreFactory.ReadModel.json") &&
//       !args.options.force
//     ) {
//       vorpal.logger.warn(
//         "./src/EventStoreFactory.ReadModel.json already exists."
//       );
//       vorpal.logger.log(
//         "\nTo reset use: tranmsute create-factory <new-password> -F\n"
//       );
//     } else {
//       const decryptedAccount = await getDecryptedAccount(args.password);
//       const web3 = getWeb3(decryptedAccount);
//       const relic = new T.Relic(web3);
//       const accounts = await relic.getAccounts();
//       try {
//         const factory = await T.Factory.create(
//           relic.web3,
//           accounts[0].toLowerCase()
//         );
//         const factoryReadModel = await T.Factory.getReadModel(
//           factory,
//           eventStoreAdapter,
//           readModelAdapter,
//           relic.web3,
//           accounts[0]
//         );
//         await writeFile(
//           "./src/EventStoreFactory.ReadModel.json",
//           JSON.stringify(factoryReadModel.state, null, 2)
//         );
//         vorpal.logger.log(
//           "\n./src/EventStoreFactory.ReadModel.json written to disk.\n"
//         );
//       } catch (e) {
//         console.log(e);
//         throw e;
//       }
//     }
//     callback();
//   });

// vorpal
//   .command(
//     "create-package-manager <password>",
//     "create an event store to use for the package manager."
//   )
//   .option("-F, --force", "OVERWRITES YOUR READ MODEL")
//   .types({ string: ["_"] })
//   .action(async (args, callback) => {
//     const setup = await init();
//     const {
//       // relic,
//       // accounts,
//       eventStoreAdapter,
//       readModelAdapter
//     } = setup;
//     if (!fs.existsSync("./src/EventStoreFactory.ReadModel.json")) {
//       vorpal.logger.error(
//         "./src/EventStoreFactory.ReadModel.json does not exist.\n"
//       );
//       vorpal.logger.info("You must run: transmute create-factory <password>\n");
//       callback();
//     } else {
//       if (
//         fs.existsSync("./src/PackageManager.ReadModel.json") &&
//         !args.options.force
//       ) {
//         vorpal.logger.warn(
//           "./src/PackageManager.ReadModel.json already exists."
//         );
//         vorpal.logger.log(
//           "\nTo reset use: tranmsute create-store <new-password> -F\n"
//         );
//       } else {
//         const decryptedAccount = await getDecryptedAccount(args.password);
//         const web3 = getWeb3(decryptedAccount);
//         const relic = new T.Relic(web3);
//         const accounts = await relic.getAccounts();
//         try {
//           let factoryReadModelJson = require("./src/EventStoreFactory.ReadModel.json");
//           const factory = await T.EventStoreFactory.At(
//             factoryReadModelJson.contractAddress
//           );
//           let whitelist = accounts.map(acc => {
//             return T.Utils.toChecksumAddress(acc);
//           });
//           let store = await T.Factory.createStore(
//             factory,
//             whitelist,
//             relic.web3,
//             accounts[0].toLowerCase()
//           );
//           // console.log(store);
//           let ps = new T.PackageService(
//             relic,
//             store,
//             eventStoreAdapter,
//             readModelAdapter
//           );
//           await ps.requireLatestReadModel();
//           // console.log(psReadModel);
//           await writeFile(
//             "./src/PackageManager.ReadModel.json",
//             JSON.stringify(ps.readModel.state, null, 2)
//           );
//           vorpal.logger.log(
//             "\n./src/PackageManager.ReadModel.json written to disk.\n"
//           );
//         } catch (e) {
//           console.log(e);
//           throw e;
//         }
//       }
//     }
//     callback();
//   });

// vorpal
//   .command(
//     "publish-package <password> <targetPath>",
//     "publishes a directory to ipfs with an store event."
//   )
//   .types({ string: ["_"] })
//   .action(async (args, callback) => {
//     if (!fs.existsSync("./src/PackageManager.ReadModel.json")) {
//       vorpal.logger.log("\n");
//       vorpal.logger.error(
//         "./src/PackageManager.ReadModel.json does not exist.\n"
//       );
//       vorpal.logger.info("run: transmute create-store <password>\n");
//       return callback();
//     }
//     const pmReadModelJson = require("./src/PackageManager.ReadModel.json");
//     let packageJsonTargetPath = path.join(
//       "./",
//       args.targetPath,
//       "package.json"
//     );
//     let fileExists = fs.existsSync(packageJsonTargetPath);
//     let dirPackageJson = require("./" + packageJsonTargetPath);
//     if (!fileExists) {
//       vorpal.logger.log("\n");
//       vorpal.logger.error("targePath does not contain package.json\n");
//       return callback();
//     }

//     const setup = await init();
//     const { eventStoreAdapter, readModelAdapter } = setup;
//     let TI = new TransmuteIpfs();
//     const decryptedAccount = await getDecryptedAccount(args.password);
//     const web3 = getWeb3(decryptedAccount);
//     const relic = new T.Relic(web3);
//     const accounts = await relic.getAccounts();
//     const ignorelist = await TI.getIgnoreList();
//     // console.log(ignorelist)
//     let results = await TI.addDirectory(args.targetPath, ignorelist);
//     // console.log(results)
//     let dirHash = results.pop().hash;
//     // console.log(dirHash)

//     let store = await T.EventStore.At(pmReadModelJson.contractAddress);
//     let ps = new T.PackageService(
//       relic,
//       store,
//       eventStoreAdapter,
//       readModelAdapter
//     );

//     let events = await ps.publishPackage(
//       dirHash,
//       dirPackageJson.name + "@" + dirPackageJson.version,
//       accounts[0].toLowerCase()
//     );
//     vorpal.logger.log(JSON.stringify(events, null, 2));

//     await writeFile(
//       "./src/PackageManager.ReadModel.json",
//       JSON.stringify(ps.readModel.state, null, 2)
//     );
//     vorpal.logger.log(
//       "\n./src/PackageManager.ReadModel.json written to disk.\n"
//     );

//     callback();
//   });

// vorpal
//   .command(
//     "delete-package <password> <packageHash>",
//     "publishes a delete event to the store, it may take some time for IPFS to stop serving the package."
//   )
//   .types({ string: ["_"] })
//   .action(async (args, callback) => {
//     if (!fs.existsSync("./src/PackageManager.ReadModel.json")) {
//       vorpal.logger.log("\n");
//       vorpal.logger.error(
//         "./src/PackageManager.ReadModel.json does not exist.\n"
//       );
//       vorpal.logger.info("run: transmute create-store <password>\n");
//       return callback();
//     }
//     const pmReadModelJson = require("./src/PackageManager.ReadModel.json");

//     if (!pmReadModelJson.model[args.packageHash]) {
//       vorpal.logger.log("\n");
//       vorpal.logger.error(
//         `${
//           args.packageHash
//         } does not exist in ./src/PackageManager.ReadModel.json\n`
//       );
//       return callback();
//     }

//     const setup = await init();
//     const { eventStoreAdapter, readModelAdapter } = setup;

//     const decryptedAccount = await getDecryptedAccount(args.password);
//     const web3 = getWeb3(decryptedAccount);
//     const relic = new T.Relic(web3);
//     const accounts = await relic.getAccounts();

//     let store = await T.EventStore.At(pmReadModelJson.contractAddress);
//     let ps = new T.PackageService(
//       relic,
//       store,
//       eventStoreAdapter,
//       readModelAdapter
//     );

//     let events = await ps.deletePackage(
//       args.packageHash,
//       accounts[0].toLowerCase()
//     );

//     JSON.stringify(events, null, 2);

//     await writeFile(
//       "./src/PackageManager.ReadModel.json",
//       JSON.stringify(ps.readModel.state, null, 2)
//     );
//     vorpal.logger.log(
//       "\n./src/PackageManager.ReadModel.json written to disk.\n"
//     );

//     callback();
//   });

// vorpal
//   .command(
//     "register <email> <password>",
//     "Create a firebase account with email and password."
//   )
//   .action(async (args, callback) => {
//     const createUser = async (email, password) => {
//       return new Promise((resolve, reject) => {
//         firebase
//           .auth()
//           .createUserWithEmailAndPassword(email, password)
//           .then(user => {
//             resolve(user);
//           })
//           .catch(error => {
//             reject(error);
//           });
//       });
//     };

//     try {
//       let user = await createUser(args.email, args.password);
//       vorpal.logger.info("User created. " + "\n");
//     } catch (error) {
//       vorpal.logger.error(error.message + "\n");
//     }

//     callback();
//   });

// vorpal
//   .command(
//     "link <email> <password>",
//     "Link your Factory and PackageManager with your firebase account."
//   )
//   .action(async (args, callback) => {
//     if (!fs.existsSync("./encryptedAccount.json")) {
//       vorpal.logger.error("No account found.");
//       vorpal.logger.info(
//         "To create an account use: create-web3-account <password> "
//       );
//       callback();
//     }

//     const login = async (email, password) => {
//       return new Promise((resolve, reject) => {
//         firebase
//           .auth()
//           .signInWithEmailAndPassword(email, password)
//           .then(user => {
//             resolve(user);
//           })
//           .catch(error => {
//             reject(error);
//           });
//       });
//     };
//     const encryptedAccount = await getEncryptedAccount();
//     const user = await login(args.email, args.password);
//     const db = app.database();
//     const ref = db.ref(`user-data/${user.uid}`);
//     await ref.set({
//       [encryptedAccount.address]: "claimed",
//       factory: require("./src/EventStoreFactory.ReadModel.json"),
//       packageManager: require("./src/PackageManager.ReadModel.json")
//     });
//     let myUserData = (await ref.once("value")).val();
//     vorpal.logger.log("Your user data (public information during alpha).\n");
//     vorpal.logger.log(JSON.stringify(myUserData, null, 2) + "\n");
//     callback();
//   });

// vorpal.use(vorpalTour, {
//   command: "tour",
//   tour: function(tour) {
//     // Colors the "tour guide" text.
//     tour.color("cyan");

//     tour
//       .step(1)
//       .begin('Welcome to the tour! Run "create-web3-account YOUR_PASSWORD".')
//       .expect("command", (data, cb) => {
//         cb(data.command.indexOf("create-web3-account") !== -1);
//       })
//       .reject('Uh.. Let\'s type "create-web3-account PASSWORD" instead...')
//       .wait(500)
//       .end("Great! You now have a ./encryptedAccount");

//     tour
//       .step(2)
//       .begin('Now you have an account. Run "address" to see it')
//       .expect("command", (data, cb) => {
//         cb(data.command === "address");
//       })
//       .reject('Uh.. Let\'s type "address" instead..')
//       .wait(500)
//       .end("See your balance is 0? Lets fix that...");

//     tour
//       .step(3)
//       .begin(
//         'Run "fund <your_address> 100000000000000000" fund your new wallet from the default web3 account.'
//       )
//       .expect("command", (data, cb) => {
//         cb(data.command.indexOf("fund") !== -1);
//       })
//       .reject(
//         'Uh.. Let\'s type "fund <your_address> 100000000000000000" instead..'
//       )
//       .wait(500)
//       .end("See your updated balance?");

//     tour
//       .step(4)
//       .begin(
//         'Now let\'s create a factory. Run "create-factory <your_password>" '
//       )
//       .expect("command", (data, cb) => {
//         cb(data.command.indexOf("create-factory") !== -1);
//       })
//       .reject('Uh.. Let\'s type "create-factory <your_password>" instead..')
//       .wait(500)
//       .end(
//         "./src/EventStoreFactory.ReadModel.json now represents your factory contract."
//       );

//     tour
//       .step(5)
//       .begin(
//         'Now let\'s create a package manager. Run "create-package-manager <your_password>" '
//       )
//       .expect("command", (data, cb) => {
//         cb(data.command.indexOf("create-package-manager") !== -1);
//       })
//       .reject(
//         'Uh.. Let\'s type "create-package-manager <your_password>" instead..'
//       )
//       .wait(500)
//       .end(
//         "./src/PackageManager.ReadModel.json now represents your store contract."
//       );

//     tour
//       .step(6)
//       .begin(
//         "Now let's publish a package. Run \"publish-package <your_password> ./data/dapp1"
//       )
//       .expect("command", (data, cb) => {
//         cb(data.command.indexOf("publish-package") !== -1);
//       })
//       .reject('Uh.. Let\'s type "publish-package <your_password>" instead..')
//       .wait(500)
//       .end(
//         "./src/PackageManager.ReadModel.json now shows your published package."
//       );

//     tour
//       .step(7)
//       .begin(
//         "Now let's create a firebase user account for use with the web app demo. Run 'register <email> <password>'."
//       )
//       .expect("command", (data, cb) => {
//         cb(data.command.indexOf("register") !== -1);
//       })
//       .reject('Uh.. Let\'s type "register <email> <password>" instead..')
//       .wait(500)
//       .end("You now have a firebase account.");

//     tour
//       .step(8)
//       .begin(
//         'Now let\'s link your Factory and PackageManager contracts with your firebase account. Run "link <email> <password>".'
//       )
//       .expect("command", (data, cb) => {
//         cb(data.command.indexOf("link") !== -1);
//       })
//       .reject('Uh.. Let\'s type "link <email> <password>" instead..')
//       .wait(500)
//       .end(
//         "You have now linked your smart contracts with your firebase account."
//       );

//     // A delay in millis between steps.
//     tour.wait(1000);

//     tour.end(
//       "Congrats! Now exit the CLI (ctrl + c) and run 'npm run start' and visit http://localhost:3000, login with your firebase account to see your packages."
//     );

//     return tour;
//   }
// });

vorpal
  .parse(process.argv)
  .delimiter('🦄   $')
  .show();
