
const http = require('https');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const fs = require('fs');

let hostname = process.env.OKTA_HOSTNAME;

const getJWKS = () => {
  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      hostname: hostname,
      port: null,
      path: '/oauth2/default/v1/keys',
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      }
    };
    var req = http.request(options, res => {
      var chunks = [];
      res.on('data', chunk => {
        chunks.push(chunk);
      });
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        const responseJson = JSON.parse(body);
        resolve(responseJson);
      });
    });
    req.end();
  });
};

const writeFile = (filepath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, data, 'UTF-8', err => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

(async () => {
  const response = await getJWKS();
  const pem = jwkToPem(response.keys[0]);
  await writeFile('./scripts/okta/okta.pem', pem);
})();
