const http = require("http");
const httpProxy = require("http-proxy");
const querystring = require("querystring");

var proxy = httpProxy.createProxyServer();

const getAuthTokenFromHeaderOrQueryString = req => {
  if (req.headers["x-transmute_auth_token"]) {
    return req.headers["x-transmute_auth_token"];
  }
  if (req.url.indexOf("?") !== -1) {
    let query = querystring.parse(req.url.split("?")[1]);
    if (query.transmute_auth_token) {
      return query.transmute_auth_token;
    }
  }
  return null;
};

http
  .createServer((req, res) => {
    const token = getAuthTokenFromHeaderOrQueryString(req);

    if (token !== "GOLDEN_TICKET") {
      res.writeHead(200);
      res.write(
        JSON.stringify({
          error: true,
          message: "You need a GOLDEN_TICKET."
        })
      );
      return res.end();
    }
    proxy.web(req, res, {
      target: "http://localhost:5001"
    });
  })
  .listen(5002);
