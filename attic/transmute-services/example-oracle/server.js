const http = require("http");

const SECRET = "the cake is a lie";
const URL = "https://example.com";

const { getHmac } = require("./common");

const server = http.createServer(async (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  let hash = await getHmac(URL, SECRET);
  res.end(hash);
});

server.listen(8080);
