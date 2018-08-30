let serviceAccount = require("./transmute-id-staging-firebase-adminsdk-uasd0-9ce3fa01fc.json");

// console.log(JSON.stringify(serviceAccount));

if (!serviceAccount) {
  let serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

  serviceAccount = JSON.parse(serviceAccountEnv);
}

module.exports = serviceAccount;
