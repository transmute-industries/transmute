const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer({
  target: "http://192.168.99.100:31557"
});

proxy.on("proxyReq", (proxyReq, req, res, options) => {
  // if (req.headers["x-transmute_auth"] !== "GOLDEN_TICKET") {
  //   res.writeHead(401);
  //   res.write("You need a GOLDEN_TICKET.");
  //   res.end();
  // }
  // proxyReq.setHeader("X-TRANSMUTE_AUTHENTICATED", "true");
  //
  //   console.log(options)
});



console.log("Proxy listening at: http://localhost:3002");
proxy.listen(3002);
