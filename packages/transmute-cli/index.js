var vorpal = require('vorpal')();

vorpal
  .delimiter('T$')
  .show();

vorpal
  .command('transmute', 'Outputs "industries"')
  .action(function(args, callback) {
    this.log('Transmute Industries');
    callback();
  });
