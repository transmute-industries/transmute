const vorpal = require('vorpal')();
const vorpalLog = require('vorpal-log');
const vorpalTour = require('vorpal-tour');
vorpal.use(vorpalLog);

const { writeFile } = require('./utils');

// import auth from './auth0/index';
const auth = require('./okta/index');
// import vault from './vault';

auth(vorpal);
// vault(vorpal);

// vorpal
//   .command('foo <requiredArg> [optionalArg]')
//   .option('-v, --verbose', 'Print foobar instead.')
//   .description('Outputs "bar".')
//   .alias('foosball')
//   .action(function(args, callback) {
//     if (args.options.verbose) {
//       this.log('foobar');
//     } else {
//       this.log('bar');
//     }
//     callback();
//   });

vorpal
  .delimiter('🦄   $')
  .show()
  .parse(process.argv);
