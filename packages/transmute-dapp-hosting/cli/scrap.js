// const path = require("path");
// const fse = require("fs-extra");
// const fs = require("fs");
// const shell = require("shelljs");
// const T = require("transmute-framework");
// const TransmuteCrypto = require("transmute-crypto");
// const transmute = require("../transmute");

// const generateTestWallets = async num => {
//   const sodium = await TransmuteCrypto.getSodium();
//   let testWallets = [];
//   for (let i = 0; i < num; i++) {
//     const alice = sodium.crypto_box_keypair();
//     const unPrefixedPrivateKeyHexString = sodium.to_hex(alice.privateKey);
//     let address = T.Utils.privateKeyHexToAddress(
//       "0x" + unPrefixedPrivateKeyHexString
//     );
//     testWallets.push({
//       address: "0x" + sodium.to_hex(address),
//       privateKey: "0x" + unPrefixedPrivateKeyHexString
//     });
//   }
//   return testWallets;
// };

// module.exports = vorpal => {
//   vorpal.command("sim", "simulate use").action(async (args, callback) => {
//     vorpal.logger.log("\n" + "Simulating...\n");

//     let subscriptions = {
//       T1: {
//         PACKAGE_LIMIT: 3,
//         SPACE_LIMIT: 1 // KB, MB, GB
//       }
//     };

//     let activeSubscriptions = {};

//     // - System generates Customer wallets for test.
//     let wallets = await generateTestWallets(3);
//     vorpal.logger.info("Customers already have accounts.");
//     vorpal.logger.log("Alice:\t" + wallets[0].address);
//     vorpal.logger.log("Bob:\t" + wallets[1].address);
//     vorpal.logger.log("Eve:\t" + wallets[2].address);
//     vorpal.logger.log("\n");

//     // - User purchases a subscription with Stripe.
//     vorpal.logger.info("Alice has T1 Subscription.");
//     activeSubscriptions[wallets[0].address] = subscriptions.T1;
//     vorpal.logger.log(activeSubscriptions);
   
//     // - System uses factory to create a store for the customer
 

//     vorpal.logger.info("Alice has EventStore");

//     // - System monitors packages deployed and utilization.
//     // - User can issue delete packages to clean up space.

//     vorpal.logger.log("\n");
//     callback();
//   });

//   return vorpal;
// };
