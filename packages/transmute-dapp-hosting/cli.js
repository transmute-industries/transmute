#!/usr/bin/env node

const vorpal = require("vorpal")();

const vorpalLog = require('vorpal-log');
 
vorpal.use(vorpalLog)

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

require("./cli/create")(vorpal);
require("./cli/sim")(vorpal);

vorpal
  .parse(process.argv)
  .delimiter("🦄   $")
  .show();
