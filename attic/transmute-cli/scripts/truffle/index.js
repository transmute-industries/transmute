
const shell = require("shelljs");

module.exports = vorpal => {

  vorpal.command("test", "run truffle test").action((args, callback) => {
    console.log("🍄  Truffle Test ...");
    if (shell.exec("truffle test").code !== 0) {
      shell.echo("Error: truffle test failed.");
      shell.exit(1);
    }
    callback();
  });

  return vorpal;
};
