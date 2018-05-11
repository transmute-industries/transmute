const login = require('./login');

module.exports = vorpal => {
  vorpal.command('login', 'Login with Okta.').action(async (args, callback) => {
    const response = await login();
    console.log('\n', response, '\n');
  });
};
