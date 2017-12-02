


var AddressSetLib = artifacts.require("../node_modules/transmute-framework/contracts/TransmuteFramework/SetLib/AddressSetLib.sol");

var EventStoreLib = artifacts.require("../node_modules/transmute-framework/contracts/TransmuteFramework/EventStoreLib.sol");
var UnsafeEventStore = artifacts.require("../node_modules/transmute-framework/contracts/TransmuteFramework/UnsafeEventStore.sol");

var PackageManager = artifacts.require("./PackageManager.sol");
var PackageManagerFactory = artifacts.require("./PackageManagerFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(AddressSetLib);

  deployer.deploy(EventStoreLib);
  deployer.link(AddressSetLib, UnsafeEventStore);
  deployer.link(EventStoreLib, UnsafeEventStore);
  deployer.deploy(UnsafeEventStore);

  deployer.link(EventStoreLib, PackageManager);
  deployer.deploy(PackageManager);

  deployer.link(AddressSetLib, PackageManagerFactory);
  deployer.link(EventStoreLib, PackageManagerFactory);
  deployer.deploy(PackageManagerFactory);

};


