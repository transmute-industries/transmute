const TestRPC = require("ethereumjs-testrpc");
const Web3 = require("web3");
const shell = require("shelljs");


jasmine.DEFAULT_TIMEOUT_INTERVAL = 10 * 1000;

module.exports = async () => {

  // let cmd;

  // cmd = "lerna run transmute-contracts:migrate";

  // if (!shell.exec(cmd)) {
  //   shell.echo("Failed to migrate transmute contracts with ", cmd);
  //   shell.exit(1);
  // }

  // cmd = "lerna bootstrap";

  // if (!shell.exec(cmd)) {
  //   shell.echo("Failed to bootstrap, abi will not be linked: ", cmd);
  //   shell.exit(1);
  // }


};
