const TransmuteFramework = require("transmute-framework").default;
const firebase = require("firebase");
require("firebase/firestore");

const contractArtifacts = {
  aca: require("transmute-framework/build/contracts/RBAC"),
  esa: require("./contracts/PackageManager"),
  esfa: require("./contracts/PackageManagerFactory")
};

let config = {
  providerUrl: "http://localhost:8545",
  ipfsConfig: {
    host: "localhost",
    port: "5001",
    options: {
      protocol: "http"
    }
  },
  ...contractArtifacts,
  TRANSMUTE_API_ROOT: "http://localhost:3001"
};

const isBrowserEnv = !(
  typeof process === "object" && process + "" === "[object process]"
);

if (isBrowserEnv) {
  config = {
    ...config,
    firebaseApp: firebase.initializeApp({
      apiKey: "AIzaSyAz5HkV4suTR49_1Cj40bQYd9Jgiv634qQ",
      authDomain: "transmute-framework.firebaseapp.com",
      databaseURL: "https://transmute-framework.firebaseio.com",
      projectId: "transmute-framework",
      storageBucket: "transmute-framework.appspot.com",
      messagingSenderId: "191884578641"
    })
  };
}

const T = TransmuteFramework.init(config);

module.exports = T;
