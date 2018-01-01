const challengeClientToSignMessage = require("./challenge");
const verifyClientHasSignedMessage = require("./verify");

const _ = require("lodash");

module.exports = functionParams => {
  switch (functionParams.query.method) {
    case "challenge":
      return challengeClientToSignMessage(functionParams);
    case "verify":
      return verifyClientHasSignedMessage(functionParams);
  }
};
