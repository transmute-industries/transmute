const https = require("https");
const crypto = require("crypto");

const getHmac = (url, secret) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, resp => {
        let data = "";
        resp.on("data", chunk => {
          data += chunk;
        });
        resp.on("end", () => {
          const hash = crypto
            .createHmac("sha256", secret)
            .update(data)
            .digest("hex");
          resolve(hash);
        });
      })
      .on("error", err => {
        reject(err);
      });
  });
};

module.exports = {
  getHmac
};
