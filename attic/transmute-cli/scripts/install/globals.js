const shell = require("shelljs");

module.exports = callback => {
  let lines = [
    "npm install -g truffle@beta",
    "npm install -g firebase-tools --engine-strict=false",
    "npm install -g ethereumjs-testrpc"
  ];
  lines.forEach(line => {
    if (shell.exec(line).code !== 0) {
      shell.echo("Error: failed to install global: " + line);
      shell.exit(1);
    }
  });
  callback();
};
