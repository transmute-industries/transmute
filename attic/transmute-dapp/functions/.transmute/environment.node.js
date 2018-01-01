const path = require("path");
const admin = require("firebase-admin");

let TransmuteFramework = require("transmute-framework").default;

const FRAMEWORK_ENV = "NODE_LOCAL";

const FRAMEWORK_ENV_PATH = path.join(
    __dirname,
    "environment.secret.env"
  );
  require("dotenv").config({ path: FRAMEWORK_ENV_PATH });

const GOOGLE_PROJECT_NAME = process.env.GOOGLE_PROJECT_NAME; 
const WEB3_PROVIDER_URL = process.env.WEB3_PROVIDER_URL; 
const TRANSMUTE_API_ROOT = process.env.TRANSMUTE_API_ROOT; 

admin.initializeApp({
  credential: admin.credential.cert(
    require('./firebase-service-account.json')
  )
});

let transmuteConfig = {
  providerUrl: WEB3_PROVIDER_URL,
  aca: require("transmute-framework/build/contracts/RBAC.json"),
  esa: require("transmute-framework/build/contracts/RBACEventStore.json"),
  esfa: require("transmute-framework/build/contracts/RBACEventStoreFactory.json"),
  TRANSMUTE_API_ROOT: TRANSMUTE_API_ROOT,
  firebaseAdmin: admin
};

module.exports = {
  TransmuteFramework,
  transmuteConfig,
  GOOGLE_PROJECT_NAME,
  WEB3_PROVIDER_URL,
  TRANSMUTE_API_ROOT,
};
