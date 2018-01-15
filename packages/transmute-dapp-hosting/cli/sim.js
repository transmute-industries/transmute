const path = require("path");
const fse = require("fs-extra");
const fs = require("fs");
const shell = require("shelljs");
const vorpal = require("vorpal")();
const T = require("transmute-framework");
const transmute = require("../transmute");

module.exports = vorpal => {
  vorpal.command("sim", "simulate use").action(async (args, callback) => {
    console.log("sim..");

    callback();
  });

  return vorpal;
};
