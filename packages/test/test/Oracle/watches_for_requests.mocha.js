// Mocha Test
const chai = require("chai");
const expect = chai.expect;
const TransmuteFramework = require("transmute-framework").default;

var contract = require("truffle-contract");

describe("mocha tests for an oracle", () => {
  let T;
  let accounts;
  let factory;
  let eventstore;
  let dappRootHash;
  let oracleCaller;
  let oracle;
  let OracleContact;
  let contractArtifacts = {
    esa: require("../../build/contracts/Oracle"),
    esfa: require("../../build/contracts/OracleFactory")
  };

  before(async () => {
    T = TransmuteFramework.init(
      Object.assign(
        {
          providerUrl: "http://localhost:8545",
          ipfsConfig: {
            host: "localhost",
            port: "5001",
            options: {
              protocol: "http"
            }
          },
          TRANSMUTE_API_ROOT: "http://localhost:3001"
        },
        contractArtifacts
      )
    );
    accounts = await T.getAccounts();
    factory = await T.EventStoreFactoryContract.deployed();
    let OracleCaller = contract(require("../../build/contracts/OracleCaller"));
    OracleCaller.setProvider(T.web3.currentProvider);
    oracleCaller = await OracleCaller.deployed()

    OracleContact = contract(require("../../build/contracts/Oracle"));
    OracleContact.setProvider(T.web3.currentProvider);
   
  });

  it("should create an oracle from the factory", async () => {
    let { events, tx } = await T.Factory.createEventStore(factory, accounts[0]);
    eventstore = await T.EventStoreContract.at(events[0].payload.address);
    oracle = await OracleContact.at(events[0].payload.address)
  });

  it("can call an oracle externally", async () => {

    console.log( await oracle.testFunction.call() )
    // console.log( await oracle.testFunction.call() )
    
    // let data = await T.EventStore.writeFSA(
    //       oracle,
    //       accounts[0],
    //       {
    //         type: "PACKAGE_DEPLOYMENT",
    //         payload: {
    //           bad: 'data',
    //           very: 'bad'
    //         }
    //       }
    //     );

    //     console.log(data)
  });

  // it("should create a contract to call the oracle", async () => {
  //   let receipt = await oracleCaller.callOracle(eventstore.address, {
  //     from: accounts[0]
  //   })
  //   console.log("subbums", receipt);
  // });

  // it("should publish the deployed package to the package manager contract", async () => {
  //   let transmutePackageJson = {
  //     name: "transmute-dapp",
  //     version: "0.1.0",
  //     dappRootHash,
  //     urls: {
  //       ipfs: "http://localhost:8080/ipfs/" + dappRootHash
  //     }
  //   };
  //   let deployedPackageEvent = await T.EventStore.writeFSA(
  //     eventstore,
  //     accounts[0],
  //     {
  //       type: "PACKAGE_DEPLOYMENT",
  //       payload: transmutePackageJson
  //     }
  //   );
  //   // This event payload is: { multihash: 'QmRtScGxnTFQxfzbP3F9ahbwiRRzJArrZvJDKdH6Ys1AYV' }
  //   // console.log(deployedPackageEvent);
  // });

  // it("can read package deployment events with the framework", async () => {
  //   let deployedPackageEvent = await T.EventStore.readFSA(
  //     eventstore,
  //     accounts[0],
  //     0
  //   );
  //   expect(deployedPackageEvent.payload.dappRootHash).to.equal(dappRootHash);
  //   // This event payload is: transmutePackageJson
  //   // console.log(deployedPackageEvent);
  // });

  after(done => {
    setTimeout(() => {
      process.exit(0);
    }, 1 * 1000);
    done();
  });
});
