#!/usr/bin/env node
// const vorpalLog = require("vorpal-log");
// const vorpal = require("vorpal")();

// // https://github.com/vorpaljs/vorpal-tour/
// // https://github.com/AljoschaMeyer/vorpal-log/

// vorpal.use(vorpalLog);

// require("./scripts")(vorpal);

// vorpal.parse(process.argv).delimiter("🦄   $").show();

const { init } = require("./transmute");

(async () => {
  const {
    T,
    relic,
    accounts
    // eventStoreAdapter,
    // readModelAdapter,
    // generateTestWallets,
    // getRelicWalletWithPrivateKey
  } = await init();
//   console.log("T", T);
  console.log(accounts);
})();

