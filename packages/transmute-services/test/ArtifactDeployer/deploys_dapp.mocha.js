// const chai = require("chai");
// const expect = chai.expect;
// const TransmuteFramework = require("transmute-framework").default;

// describe("mocha tests for deploying a dapp", () => {
//   let T;
//   let accounts;
//   let factory;
//   let eventstore;
//   let dappRootHash;
//   let contractArtifacts = {
//     esa: require("../../build/contracts/ArtifactDeployer"),
//     esfa: require("../../build/contracts/ArtifactDeployerFactory")
//   };

//   before(async () => {
//     T = TransmuteFramework.init(
//       Object.assign(
//         {
//           providerUrl: "http://localhost:8545",
//           ipfsConfig: {
//             host: "localhost",
//             port: "5001",
//             options: {
//               protocol: "http"
//             }
//           },
//           TRANSMUTE_API_ROOT: "http://localhost:3001"
//         },
//         contractArtifacts
//       )
//     );
//     accounts = await T.getAccounts();
//     factory = await T.EventStoreFactoryContract.deployed();
//   });

//   it("should create a package manager contract from the factory", async () => {
//     let { events, tx } = await T.Factory.createEventStore(factory, accounts[0]);
//     eventstore = await T.EventStoreContract.at(events[0].payload.address);
//   });

//   it("should publish a package to ipfs", async () => {
//     let ipfsHashes = await T.TransmuteIpfs.addFromFs("./example-dapp");
//     dappRootHash = ipfsHashes[ipfsHashes.length - 1].hash;
//   });

//   it("should publish the deployed package to the package manager contract", async () => {
//     let transmutePackageJson = {
//       name: "transmute-dapp",
//       version: "0.1.0",
//       dappRootHash,
//       urls: {
//         ipfs: "http://localhost:8080/ipfs/" + dappRootHash
//       }
//     };
//     let deployedPackageEvent = await T.EventStore.writeFSA(
//       eventstore,
//       accounts[0],
//       {
//         type: "PACKAGE_DEPLOYMENT",
//         payload: transmutePackageJson
//       }
//     );
//     // This event payload is: { multihash: 'QmRtScGxnTFQxfzbP3F9ahbwiRRzJArrZvJDKdH6Ys1AYV' }
//     // console.log(deployedPackageEvent);
//   });

//   it("can read package deployment events with the framework", async () => {
//     let deployedPackageEvent = await T.EventStore.readFSA(
//       eventstore,
//       accounts[0],
//       0
//     );
//     expect(deployedPackageEvent.payload.dappRootHash).to.equal(dappRootHash);
//     // This event payload is: transmutePackageJson
//     // console.log(deployedPackageEvent);
//   });

//   after(done => {
//     setTimeout(() => {
//       process.exit(0);
//     }, 1 * 1000);
//     done();
//   });
// });
