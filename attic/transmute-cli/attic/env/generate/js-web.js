const Mustache = require("mustache");
const fs = require("fs");
const path = require("path");
const Promise = require("bluebird");
const readFile = Promise.promisify(require("fs").readFile);
const writeFile = Promise.promisify(require("fs").writeFile);

// yarn transmute gen-web js ./environment.web.js

module.exports = async (args, callback) => {
  let { outputEnvPath } = args;
  let file = await readFile(
    path.join(__dirname, "./templates/js-web-env.handlebars")
  );
  let variables = {};
  var output = Mustache.render(file.toString(), variables);
  let outputFile = await writeFile(outputEnvPath, output);
  callback();
};
