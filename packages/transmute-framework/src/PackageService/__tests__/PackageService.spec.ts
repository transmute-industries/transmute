// import { getSetupAsync } from "../../__mocks__/setup";

// import { W3, Relic, PackageService, Utils } from "../../transmute-framework";

// import * as TransmuteCrypto from "transmute-crypto";



// /**
//  * PackageService test
//  */
// describe("PackageService", () => {
//   let relic: any;
//   let accounts: string[];
//   let ps: PackageService;

//   beforeAll(async () => {
//     let setup = await getSetupAsync();
//     relic = setup.relic;
//     // accounts = setup.accounts;
//     // let packageManager = await PackageService.New(accounts[0]);
//     // ps = new PackageService(packageManager, setup.eventStoreAdapter);
//   });

//   // it("Static NewContract creates a new contract...", async () => {
//   //   expect(ps.packageManager.address).toBeDefined();
//   // });

//   test("new users can publish packages", async () => {
//     // console.log('happy', TransmuteCrypto)

//     // user creates key pair
//     // let sodium = await TransmuteCrypto.getSodium();
//     // let alice = sodium.crypto_box_keypair();
//     // let alicePrivKeyHex = '0x' + sodium.to_hex(alice.privateKey)
//     // console.log(alicePrivKeyHex)
//     // let aliceAddress = Utils.privateKeyHexToAddress(alicePrivKeyHex)
//     // console.log(aliceAddress)


//     // user registers new key pair with contract
//     // relic.web3.eth.accounts.privateKeyToAccount();
//     // let updatedAccount = await relic.getAccounts();
//     // console.log(relic.web3.eth)

//     // user publishes package to contract



//   });
// });


// import { getSetupAsync } from "../../__mocks__/setup";

// import { W3, Relic, Utils } from "../../transmute-framework";

// import * as TransmuteCrypto from "transmute-crypto";

// const util = require("ethereumjs-util");

// const Tx = require("ethereumjs-tx");

// /**
//  * Basic Tests test
//  */
// describe("Basic Tests", () => {
//   let relic: any;
//   let accounts: string[];

//   beforeAll(async () => {
//     relic = new Relic({
//       providerUrl: "http://localhost:8545"
//     });

//     accounts = await relic.getAccounts();
//   });

//   const fundAddressFromRelic = async toAddress => {
//     let data = await relic.web3.eth.sendTransaction({
//       from: accounts[0],
//       to: toAddress,
//       value: 150000000000000000
//     });
//     let bal = await relic.getBalance(toAddress);
//     // console.log(bal);
//   };

//   const signTx = async privateKey => {
//     let rawTx = {
//       nonce: "0x00",
//       gasLimit: "0x5410",
//       to: "0x0000000000000000000000000000000000000000",
//       value: "0x00",
//       data: Utils.bufferToHex(new Buffer("hello"))
//     };
//     console.log(Utils.toAscii(rawTx.data));
//     let tx = new Tx(rawTx);
//     tx.sign(privateKey);
//     let serializedTx = tx.serialize();
//     return new Promise((resolve, reject) => {
//       relic.web3.eth.sendRawTransaction("0x" + serializedTx.toString("hex"), function(err, hash) {
//         if (!err) {
//           // console.log(hash);
//           resolve(hash);
//         } else {
//           console.log(err);
//         }
//       });
//     });
//   };

//   test("simple transaction signing... without web3 1.0...", async () => {
//     // console.log('happy', TransmuteCrypto)

//     // user creates key pair
//     let sodium = await TransmuteCrypto.getSodium();
//     let alice = sodium.crypto_box_keypair();
//     let alicePrivKeyHex = sodium.to_hex(alice.privateKey);
//     // console.log(alicePrivKeyHex);
//     let privateKey = new Buffer(alicePrivKeyHex, "hex");
//     let aliceAddress = "0x" + sodium.to_hex(util.privateToAddress(privateKey));

//     await fundAddressFromRelic(aliceAddress);

//     await signTx(privateKey);

//     // user registers new key pair with contract
//     // relic.web3.eth.accounts.privateKeyToAccount(sodium.to_hex(alice.privateKey));
//     // let updatedAccount = await relic.getAccounts();
//     // console.log(relic.web3.eth)

//     // user publishes package to contract
//   });
// });
