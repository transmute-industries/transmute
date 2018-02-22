var AddressSetLib = artifacts.require(
  "transmute-contracts/contracts/TransmuteFramework/SetLib/AddressSetLib.sol"
);
var Bytes32SetLib = artifacts.require(
  "transmute-contracts/contracts/TransmuteFramework/SetLib/Bytes32SetLib.sol"
);
var EventStoreLib = artifacts.require(
  "transmute-contracts/contracts/TransmuteFramework/EventStoreLib.sol"
);
var EventStore = artifacts.require(
  "transmute-contracts/contracts/TransmuteFramework/EventStore.sol"
);
var PackageManager = artifacts.require("./PackageManager.sol");

module.exports = function(deployer) {

  deployer.deploy(AddressSetLib);
  deployer.deploy(Bytes32SetLib);
  
  deployer.deploy(EventStoreLib);
  deployer.link(AddressSetLib, EventStore);
  deployer.link(Bytes32SetLib, EventStore);
  deployer.link(EventStoreLib, EventStore);
  deployer.deploy(EventStore);

  deployer.link(EventStore, PackageManager);
  deployer.link(AddressSetLib, PackageManager);
  deployer.link(Bytes32SetLib, PackageManager);
  deployer.link(EventStoreLib, PackageManager);
  deployer.deploy(PackageManager);
};
