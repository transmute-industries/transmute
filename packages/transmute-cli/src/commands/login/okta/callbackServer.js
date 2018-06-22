const http = require('http');
const URL = require('url-parse');
const formurlencoded = require('form-urlencoded');
const request = require('request');
const port = 3001;

const config = require('./config');

module.exports = code_verifier => {
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      var url = new URL(req.url, true);

      const { code, state } = url.query;

      //     curl --request POST \
      // --url https://dev-665774.oktapreview.com/oauth2/default/v1/token \
      // --header 'accept: application/json' \
      // --header 'cache-control: no-cache' \
      // --header 'content-type: application/x-www-form-urlencoded' \
      // --data 'grant_type=authorization_code&client_id=0oabygpxgk9lXaMgF0h7&redirect
      // _uri=yourApp%3A%2Fcallback&code=CKA9Utz2GkWlsrmnqehz&code_verifier=M25iVXpKU
      // 3puUjFaYWg3T1NDTDQtcW1ROUY5YXlwalNoc0hhakxifmZHag'

      var options = {
        method: 'POST',
        url: `https://${config.okta_host}/oauth2/default/v1/token`,
        headers: {
          accept: 'application/json',
          'cache-control': 'no-cache',
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: formurlencoded({
          grant_type: 'authorization_code',
          client_id: config.client_id,
          code_verifier: code_verifier,
          code: code,
          redirect_uri: config.redirect_uri
        })
      };

      request(options, function(error, resp, body) {
        if (error) throw new Error(error);

        res.end(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Transmute CLI Login</title>
            <style>
            body {
              margin: 0;
              padding: 0;
              font-family: sans-serif;
              background-image: url("https://source.unsplash.com/random/1280x1024");
              background-size: cover;
              height: 100%;
            }
            </style>
          </head>
          <body>
          <p>You are now logged in the transmute cli...</p>
        <p>You can safely close this tab</p>
          </body>
        </html>
        `);

        resolve(JSON.parse(body));
      });
    });

    server.listen(port, err => {
      if (err) {
         console.debug('something bad happened', err);
        reject(err);
      }
      console.debug(`server is listening on ${port}`);
    });
  });
};
