var OracleFactory = artifacts.require("./OracleFactory.sol");
var Oracle = artifacts.require("./Oracle.sol");
var OracleCaller = artifacts.require("./OracleCaller.sol");

const chai = require("chai");
const expect = chai.expect;
const TransmuteFramework = require("transmute-framework").default;

const listenForRequest = oracle => {
  return new Promise((resolve, reject) => {
    var events = oracle.allEvents();
    events.watch(function(error, event) {
      if (error) {
        console.log("Error: " + error);
        reject(error);
      } else {
        // console.log(event.event + ": " + JSON.stringify(event.args));
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
    callerCallback: T.EventStore.Common.toAscii(values[3]),
    oracleResponse: T.EventStore.Common.toAscii(values[4])
  };
};

contract("works with framework", accounts => {
  let factory;
  let oracleAddress;
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

    factory = await OracleFactory.deployed();
    oracleCaller = await OracleCaller.deployed();
  });

  it("OracleFactory can create an oracle", async () => {
    let { events, tx } = await T.Factory.createEventStore(factory, accounts[0]);
    oracleAddress = events[0].payload.address;
    oracle = await Oracle.at(oracleAddress);
  });

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

  it("protocol", async () => {
    // trigger caller, caller will make a request
    let receipt;
    let fsaEvent;
    receipt = await oracleCaller.trigger(oracle.address, {
      from: accounts[0]
    });

    expect(receipt.logs[0].event).to.equal("EsEvent");

    // oracle service listens to oracle contract for request events
    fsaEvent = T.EventStore.Common.getFSAFromEventArgs(receipt.logs[0].args);
    // console.log("heard request: ", fsaEvent.payload.guid);

    let orcTx = unmarshalOrcTx(
      await oracle.getTransactionByGuid.call(fsaEvent.payload.guid, {
        from: accounts[0]
      })
    );

    // console.log(orcTx);

    // oracle service computes answer to request and updates contract
    let result = "T:"+ eval(orcTx.callerRequest).toFixed(4).toString()
    // console.log(result)
    receipt = await oracle.respondBytes32(orcTx.guid, result, {
      from: accounts[0]
    });

    fsaEvent = T.EventStore.Common.getFSAFromEventArgs(receipt.logs[0].args);

    // console.log("heard response: ", fsaEvent);

    // has the oracle transaction been updated in the oracle?
    orcTx = unmarshalOrcTx(
      await oracle.getTransactionByGuid.call(fsaEvent.payload.guid, {
        from: accounts[0]
      })
    );
    expect(orcTx.oracleResponse).to.equal(result)
    // console.log(orcTx)

    // oracleCaller is updated when response is received.
    receipt = await oracleCaller.check({
      from: accounts[0]
    });

    let callerState = T.EventStore.Common.toAscii(receipt.logs[0].args.data);
    expect(callerState).to.equal(result)
  });
});
