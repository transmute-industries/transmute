#!/usr/bin/env node
const path = require("path");
const fse = require("fs-extra");
const fs = require("fs");
const shell = require("shelljs");
const Web3 = require("web3");
const ProviderEngine = require("web3-provider-engine");
const RpcSubprovider = require("web3-provider-engine/subproviders/rpc");
const WalletSubprovider = require("web3-provider-engine/subproviders/wallet");
const TC = require("transmute-crypto");

const RPC_HOST = "http://localhost:8545";

const engine = new ProviderEngine();
let mneumonic = TC.generateMnemonic();
let wallet = TC.getWalletFromMnemonic(mneumonic);

engine.addProvider(
  new RpcSubprovider({
    rpcUrl: RPC_HOST
  })
);

engine.addProvider(new WalletSubprovider(wallet, {}));
engine.start();

let web3 = new Web3(engine);

// let web3 = new Web3(new Web3.providers.HttpProvider(RPC_HOST));

let sleep = seconds => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, seconds * 1000);
  });
};

let getAccounts = web3 => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      console.log(err, accounts);
      resolve(accounts);
    });
  });
};

const vorpal = require("vorpal")();

const vorpalLog = require("vorpal-log");

vorpal.use(vorpalLog);

vorpal
  .command("version", "display version information")
  .action(async (args, callback) => {
    console.log(
      "transmute-create-react-app:\t",
      require("./package.json").version
    );
    console.log(
      "transmute-framework:\t\t",
      require("transmute-framework/package.json").version
    );

    await getAccounts(web3);
    callback();
  });

// require("./cli/create")(vorpal);
// // require("./cli/sim")(vorpal);
// require("./cli/init")(vorpal);

vorpal
  .parse(process.argv)
  .delimiter("🦄   $")
  .show();
