var Oracle = artifacts.require("./Oracle.sol");
var OracleCaller = artifacts.require("./OracleCaller.sol");

const chai = require("chai");
const expect = chai.expect;
const TransmuteFramework = require("transmute-framework").default;

const listenForRequest = (T, accounts, oracle, caller) => {
  return new Promise((resolve, reject) => {
    // oracle service listens to oracle contract for all events
    let result;
    var events = oracle.allEvents();
    events.watch(async function(error, event) {
      if (error) {
        console.log("Error: " + error);
        reject(error);
      } else {
        let fsaEvent = T.EventStore.Common.getFSAFromEventArgs(event.args);
        let orcTx = unmarshalOrcTx(
          await oracle.getTransactionByGuid.call(fsaEvent.payload.guid, {
            from: accounts[0]
          })
        );

        if (fsaEvent.type == "REQUEST") {
          // oracle service computes answer to request and updates contract
          result = "T:" + eval(orcTx.callerRequest).toFixed(4).toString();
          await oracle.respondBytes32(orcTx.guid, result, {
            from: accounts[0]
          });
        } else if (fsaEvent.type == "RESPONSE") {
          // has the oracle transaction been updated in the oracle?
          expect(orcTx.oracleResponse).to.equal(result);
          // oracleCaller is updated when response is received.
          let state = await caller.state.call({ from: accounts[0] });
          let callerState = T.EventStore.Common.toAscii(state);
          expect(callerState).to.equal(result)
        }
        resolve(event);
      }
    });
  });
};

const unmarshalOrcTx = values => {
  return {
    guid: values[0],
    callerAddress: values[1],
    callerRequest: T.EventStore.Common.toAscii(values[2]),
    oracleResponse: T.EventStore.Common.toAscii(values[3])
  };
};

contract("works with framework", accounts => {
  let oracle;
  let oracleCaller;

  before(async () => {
    T = TransmuteFramework.init({
      providerUrl: "http://localhost:8545",
      ipfsConfig: {
        host: "localhost",
        port: "5001",
        options: {
          protocol: "http"
        }
      },
      TRANSMUTE_API_ROOT: "http://localhost:3001"
    });

    oracle = await Oracle.deployed();
    oracleCaller = await OracleCaller.deployed();

    listenForRequest(T, accounts, oracle, oracleCaller);
  });


  it("oracle whitelist", async () => {
    await oracle.setWhitelist([oracleCaller.address, accounts[0]], {
      from: accounts[0],
      gas: 2000000
    });
    let whitelist = await oracle.getWhitelist({
      from: accounts[0],
      gas: 2000000
    });
    assert.deepEqual([oracleCaller.address, accounts[0]], whitelist)
  });

  it("protocol", async () => {
    // trigger caller, caller will make a request
    await oracleCaller.trigger({ from: accounts[0] });
  });
});
