const http = require('https');
const querystring = require('querystring');

const hostname = process.env.OKTA_HOSTNAME;
const clientId = process.env.OKTA_CLIENT_ID;
const clientSecret = process.env.OKTA_CLIENT_SECRET;
const username = process.env.OKTA_USERNAME;
const password = process.env.OKTA_PASSWORD;

return new Promise((resolve, reject) => {
  var options = {
    method: 'POST',
    hostname: hostname,
    port: null,
    path:
      '/oauth2/default/v1/token?' +
      querystring.stringify({
        grant_type: 'password',
        username,
        password,
        scope: 'openid'
      }),
    headers: {
      accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded',
      'content-length': '0',
      authorization:
        'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
    }
  };

  var req = http.request(options, function(res) {
    var chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });
    res.on('end', function() {
      const responseJson = JSON.parse(Buffer.concat(chunks).toString());
      console.log(responseJson.access_token);
      resolve(responseJson.access_token);
    });
  });

  req.end();
});
