const run = require('../runner');

const path = require('path');

module.exports.debug = () => {
  let command = path.join(__dirname, './debug ');
  run.shellExec(command);
};
