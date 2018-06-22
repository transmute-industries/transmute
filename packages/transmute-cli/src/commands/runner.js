const shell = require('shelljs');
const ps = require('child_process');

module.exports.shellExec = command2run => {
  let result = shell.exec(command2run);

  if (result.code !== 0) {
    throw new Error('Command FAILED, tell us what happened so we can fix it: https://github.com/transmute-industries/transmute/issues/new');
  }
  return result;
};

module.exports.spawn = (command2run, this_arg1, this_arg2) => {
  return ps.execFileSync(command2run, [this_arg1, this_arg2], {
    stdio: 'inherit'
  });
};
