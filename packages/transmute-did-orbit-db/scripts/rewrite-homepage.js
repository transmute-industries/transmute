const fs = require("fs");
const path = require("path");
const stringify = require('json-stringify-deterministic');

const pack = require("../package.json");

pack.homepage = pack.hostingOptions[process.argv[2]];

fs.writeFileSync(
  path.resolve(__dirname, "../package.json"),
  stringify(pack, null, 2)
);
