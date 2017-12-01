var AddressSetLib = artifacts.require("../node_modules/transmute-framework/contracts/TransmuteFramework/SetLib/AddressSetLib.sol");
var EventStoreLib = artifacts.require("../node_modules/transmute-framework/contracts/TransmuteFramework/EventStoreLib.sol");

var ArtifactDeployer = artifacts.require("./ArtifactDeployer.sol");
var ArtifactDeployerFactory = artifacts.require("./ArtifactDeployerFactory.sol");

var Oracle = artifacts.require("./Oracle.sol");
var OracleFactory = artifacts.require("./OracleFactory.sol");

var OracleCaller = artifacts.require("./OracleCaller.sol");

module.exports = function(deployer) {
  deployer.deploy(AddressSetLib);
  deployer.deploy(EventStoreLib);

  deployer.link(AddressSetLib, ArtifactDeployer);
  deployer.link(EventStoreLib, ArtifactDeployer);
  deployer.deploy(ArtifactDeployer);

  deployer.link(AddressSetLib, ArtifactDeployerFactory);
  deployer.link(EventStoreLib, ArtifactDeployerFactory);
  deployer.deploy(ArtifactDeployerFactory);

  deployer.link(AddressSetLib, Oracle);
  deployer.link(EventStoreLib, Oracle);
  deployer.deploy(Oracle);

  deployer.link(AddressSetLib, OracleFactory);
  deployer.link(EventStoreLib, OracleFactory);
  deployer.deploy(OracleFactory);

  deployer.link(AddressSetLib, OracleCaller);
  deployer.link(Oracle, OracleCaller).then(() => {
    return deployer.deploy(OracleCaller, Oracle.address);
  });
};


