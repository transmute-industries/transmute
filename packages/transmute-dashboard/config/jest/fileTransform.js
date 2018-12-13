'use strict';

const path = require('path');
const stringify = require('json-stringify-deterministic');

// This is a custom Jest transformer turning file imports into filenames.
// http://facebook.github.io/jest/docs/en/webpack.html

module.exports = {
  process(src, filename) {
    return `module.exports = ${stringify(path.basename(filename))};`;
  },
};
