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

  it("protocol", async () => {
    // trigger caller, caller will make a request
    await oracleCaller.trigger({ from: accounts[0] });
  });

  // it("OracleFactory can create an oracle", async () => {
  //   let { events, tx } = await T.Factory.createEventStore(factory, accounts[0]);
  //   oracleAddress = events[0].payload.address;
  //   oracle = await Oracle.at(oracleAddress);
  // });

  // it("oracle has requestBytes32 method", async () => {
  //   let guid = '0'
  //   let request = 'Math.random()'
  //   let callback = 'receive(bytes32)'
  //   let receipt = await oracle.requestBytes32(guid, request, callback, {
  //     from: accounts[0]
  //   });
  //   expect(receipt.logs[0].event).to.equal("EsEvent");
  // });

  // it("oracle has respondBytes32 method", async () => {
  //   let guid = '0'
  //   let result = "T:"+ Math.random().toFixed(4).toString()
  //   let receipt = await oracle.respondBytes32(guid, result, {
  //     from: accounts[0]
  //   });
  //   expect(receipt.logs[0].event).to.equal("EsEvent");
  // });
});
