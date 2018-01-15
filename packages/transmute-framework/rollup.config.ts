import resolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";
import commonjs from "rollup-plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import replace from "rollup-plugin-re";
import camelCase from "lodash.camelcase";

const pkg = require("./package.json");

const libraryName = "transmute-framework";

export default {
  input: `dist/es/${libraryName}.js`,
  output: [
    { file: pkg.main, name: camelCase(libraryName), format: "umd" },
    { file: pkg.module, format: "es" }
  ],
  sourcemap: true,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [
    "tar",
    "crypto",
    "websocket",
    "scrypt",
    // 'lodash',
    "lib/web3.min",
    // "bignumber.js"
    "soltsice"
  ],
  globals: {
    "lib/web3.min": "Web3",
    crypto: "crypto"
    // "bignumber.js": "BigNumber"
  },
  watch: {
    include: "dist/es/**"
  },
  plugins: [
    json({}),

    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve({
      preferBuiltins: true,
      jsnext: true,
      main: true,
      browser: true,
      extensions: [".js", ".json"]
    }),

    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs({
      namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        "node_modules/soltsice/dist/src/index.js": ["W3", "SoltsiceContract"]
      }
    }),

    replace({
      patterns: [
        {
          match: /TransmuteContracts(\/|\\)/,
          test: /'..\/contracts\/.*\.json'/g,
          replace: somePath => {
            return somePath.replace('..', '.')
          }
        }
      ]
    }),

    // Resolve source maps to the original source
    sourceMaps()
  ]
};
