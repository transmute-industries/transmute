const _ = require("lodash");

// http://functions.transmute.industries/echo?hello=world/

const makeResponseObject = data => {
  return new Promise((resolve, reject) => {
    resolve({
      status: 200,
      body: data,
      redirect: null
    });
  });
};

module.exports = functionParams => {
  // normally all work would be done here.
  // redirect, body and status are used handled the same way by server and cloud function

  const {
    TransmuteFramework,
    transmuteConfig
  } = require("../../.transmute/environment.node");

  TransmuteFramework.init(transmuteConfig);
  return TransmuteFramework.getAccounts().then(accounts => {
    return makeResponseObject({
      echo: functionParams,
      message: "Development in progress ...",
      config: _.omit(
        TransmuteFramework.config,
        "firebaseApp",
        "firebaseAdmin",
        "aca",
        "esa",
        "esfa"
      ),
      accounts
    });
  });
};
