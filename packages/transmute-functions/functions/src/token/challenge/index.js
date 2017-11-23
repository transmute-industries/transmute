const { TransmuteFramework, transmuteConfig } = require("../../../.transmute/environment.node");
TransmuteFramework.init(transmuteConfig);
const T = TransmuteFramework;

const moment = require("moment");
const uuidv4 = require("uuid/v4");
const _ = require("lodash");

const TokenChallengeStore = require("../TokenChallengeStore");

const confirmAddressSignedMessage = (address, message, signature) => {
  return T.Toolbox.recover(message, signature).then(recoveredAddress => {
    return recoveredAddress === address;
  });
};

const generateChallengeObjectForAddressToSign = (
  tcs,
  client_address,
  client_message_raw
) => {
  // SIGN THIS TO PROVE YOU CONTROL ADDRESS
  const timestamp = moment().unix();
  const uuid = uuidv4();
  const message_raw = `${uuid}.${client_address}.${client_message_raw}`;
  let function_address;
  return T.getAccounts()
    .then(addresses => {
      function_address = addresses[1];
      return function_address;
    })
    .then(function_address => {
      return T.Toolbox.sign(function_address, message_raw);
    })
    .then(signatureObject => {
      const tokenChallengeObject = {
        client_address,
        client_message_raw,
        function_address,
        timestamp,
        uuid,
        message_raw,
        message_hex: signatureObject.messageBufferHex,
        message_signature: signatureObject.signature,
        token_issued: false
      };
      return tcs.set(tokenChallengeObject);
    });
};

module.exports = functionParams => {
  const { message_raw, message_signature, address } = functionParams.query;
  let didClientAddressSignMessageRaw, tcs;
  // console.log(TransmuteFramework.db)
  tcs = new TokenChallengeStore(TransmuteFramework.db);
  return confirmAddressSignedMessage(address, message_raw, message_signature)
    .then(_didClientAddressSignMessageRaw => {
      didClientAddressSignMessageRaw = _didClientAddressSignMessageRaw;
      return generateChallengeObjectForAddressToSign(tcs, address, message_raw);
    })
    .then(challengeObject => {
      return {
        status: 200,
        body: {
          // callingArgs: _.omit(functionParams, "db", "admin"),
          conditions: {
            didClientAddressSignMessageRaw
          },
          challenge: challengeObject.message_raw
        },
        redirect: null
      };
    });
};
