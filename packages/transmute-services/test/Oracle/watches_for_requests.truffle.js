var OracleFactory = artifacts.require("./OracleFactory.sol");
var Oracle = artifacts.require("./Oracle.sol");
var OracleCaller = artifacts.require("./OracleCaller.sol");

const chai = require("chai");
const expect = chai.expect;
const TransmuteFramework = require("transmute-framework").default;

contract("works with framework", accounts => {
  let factory;
  let oracleAddress;
  let eventStore;
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

  it("OracleFactory can create an Oracle", async () => {
    let { events, tx } = await T.Factory.createEventStore(factory, accounts[0]);
    oracleAddress = events[0].payload.address;
    eventStore = await Oracle.at(oracleAddress);
    let name = await eventStore.ORACLE_NAME();
    console.log(name)
  });

  it("OracleCaller is deployed", async () => {


    // console.log(await oracleCaller.callOracle(oracleAddress, {
    //   from: accounts[0]
    // }))
  

   
  });
});
