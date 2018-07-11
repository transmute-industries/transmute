const path = require('path');

const run = require('../runner');

module.exports.listKeys = async (args) => {
  command = path.join(__dirname, './gpg_list ');
  run.shellExec(command);
} 
