const fs = require("fs");
const rimraf = require("rimraf");
const path = require("path");
const ncp = require("ncp").ncp;
ncp.limit = 16;

module.exports.add = (src, dst, _callback) => {
  ncp(src + "/", dst + "/", _callback);
};

module.exports.remove = (dst, _callback) => {
  rimraf(dst, _callback);
};
