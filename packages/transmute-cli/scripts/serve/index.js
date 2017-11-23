const path = require("path");
const shell = require("shelljs");

module.exports = vorpal => {
  vorpal
    .command("serve ", "run cloud functions server with env locally.")
    .action((args, callback) => {
      if (
        shell.exec("node " + path.join(__dirname, "./server.js")).code !== 0
      ) {
        shell.echo("Error: failed to run local function server.");
        shell.exit(1);
      }
      callback();
    });

  return vorpal;
};
