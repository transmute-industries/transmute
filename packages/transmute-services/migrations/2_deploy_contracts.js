


var AddressSetLib = artifacts.require("../node_modules/transmute-framework/contracts/TransmuteFramework/SetLib/AddressSetLib.sol");

var EventStoreLib = artifacts.require("../node_modules/transmute-framework/contracts/TransmuteFramework/EventStoreLib.sol");
var UnsafeEventStore = artifacts.require("../node_modules/transmute-framework/contracts/TransmuteFramework/UnsafeEventStore.sol");
var UnsafeEventStoreFactory = artifacts.require("./UnsafeEventStoreFactory.sol");


var ArtifactDeployer = artifacts.require("./ArtifactDeployer.sol");
var ArtifactDeployerFactory = artifacts.require("./ArtifactDeployerFactory.sol");


var Oracle = artifacts.require("./Oracle.sol");
var OracleFactory = artifacts.require("./OracleFactory.sol");

var OracleCaller = artifacts.require("./OracleCaller.sol");

module.exports = function(deployer) {
  deployer.deploy(AddressSetLib);

  deployer.deploy(EventStoreLib);
  deployer.link(AddressSetLib, UnsafeEventStore);
  deployer.link(EventStoreLib, UnsafeEventStore);
  deployer.deploy(UnsafeEventStore);

  deployer.link(EventStoreLib, UnsafeEventStoreFactory);
  deployer.link(AddressSetLib, UnsafeEventStoreFactory);
  deployer.link(UnsafeEventStore, UnsafeEventStoreFactory);
  deployer.deploy(UnsafeEventStoreFactory);

  deployer.link(EventStoreLib, ArtifactDeployer);
  deployer.deploy(ArtifactDeployer);

  deployer.link(AddressSetLib, ArtifactDeployerFactory);
  deployer.link(EventStoreLib, ArtifactDeployerFactory);
  deployer.link(ArtifactDeployer, ArtifactDeployerFactory);
  deployer.deploy(ArtifactDeployerFactory);

  deployer.link(EventStoreLib, Oracle);
  deployer.deploy(Oracle);

  deployer.link(AddressSetLib, OracleFactory);
  deployer.link(EventStoreLib, OracleFactory);
  deployer.link(ArtifactDeployer, OracleFactory);
  deployer.deploy(OracleFactory);

  deployer.link(Oracle, OracleCaller);
  deployer.deploy(OracleCaller);

};


