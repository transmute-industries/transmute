const _ = require("lodash");

const COLLECTION = "token_challenges";

module.exports = class TokenChallengeStore {
  constructor(db) {
    this.db = db;
  }

  validateChallengeObject(challengeObject) {
    const exampleObject = {
      client_address:
        "0x6b4b9605fd739922a4cc44ffc65281cd58bb58717d162b5331e41af970d173f4",
      client_message_raw: "msg",
      function_address:
        "0x6b4b9605fd739922a4cc44ffc65281cd58bb58717d162b5331e41af970d173f4",
      timestamp: 1507395150,
      uuid: "b32c3d49-619b-4995-9752-d8f593948f55",
      message_raw:
        "NaCl.b32c3d49-619b-4995-9752-d8f593948f55.1507395150.0x6b4b9605fd739922a4cc44ffc65281cd58bb58717d162b5331e41af970d173f4",
      message_hex:
        "0x31b9ad06f289b163426eda9a45190b533de566d3ad189593c1ab286bb5de035c",
      message_signature:
        "0xf7f1740e80fd1a26d8d4f001f8768f89ff523e2d51ee7078f049c1c3b680fc5444429bd9e9f9b7ad19e13c8d936dc215b88a8047fcbf86f3351420870d75652001",
      token_issued: false
    };
    const required_keys = _.keys(exampleObject).sort();
    const candidate_keys = _.keys(challengeObject).sort();

    const doesChallengeObjectHaveRequiredKeys = _.isEqual(
      required_keys,
      candidate_keys
    );
    return doesChallengeObjectHaveRequiredKeys;
  }

  get(address) {
    // console.log("getting...");
    return this.db.collection(COLLECTION).doc(address).get().then(doc => {
      let json = doc.data();
      // console.log("getting token challenge: ", json);
      return json;
    });
  }

  set(challengeObject) {
    if (!this.validateChallengeObject(challengeObject)) {
      console.log(challengeObject);
      throw Error("Invalid challengeObject. ", challengeObject);
    }
    // console.log("setting token challenge: ", challengeObject);
    return this.db
      .collection(COLLECTION)
      .doc(challengeObject.client_address)
      .set(challengeObject)
      .then(() => {
        return challengeObject;
      });
  }
};
