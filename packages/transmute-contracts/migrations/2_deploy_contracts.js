const Ownable = artifacts.require('./TransmuteFramework/Ownable.sol')
const Destructible = artifacts.require('./TransmuteFramework/Destructible.sol')

const StringUtils = artifacts.require('./TransmuteFramework/StringUtils.sol')

const AddressSetLib = artifacts.require('./TransmuteFramework/SetLib/AddressSet/AddressSetLib.sol')
const AddressSetSpec = artifacts.require('./TransmuteFramework/SetLib/AddressSet/AddressSetSpec.sol')

const Bytes32SetLib = artifacts.require('./TransmuteFramework/SetLib/Bytes32Set/Bytes32SetLib.sol')
const Bytes32SetSpec = artifacts.require('./TransmuteFramework/SetLib/Bytes32Set/Bytes32SetSpec.sol')

const UIntSetLib = artifacts.require('./TransmuteFramework/SetLib/UIntSet/UIntSetLib.sol')
const UIntSetSpec = artifacts.require('./TransmuteFramework/SetLib/UIntSet/UIntSetSpec.sol')

const EventStoreLib = artifacts.require('./TransmuteFramework/EventStoreLib.sol')
const EventStore = artifacts.require("./TransmuteFramework/EventStore.sol");
const EventStoreFactory = artifacts.require("./TransmuteFramework/EventStoreFactory.sol");

const PackageManager = artifacts.require("./TransmuteFramework/PackageManager.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(StringUtils);

  deployer.deploy(Ownable);
  deployer.link(Ownable, Destructible);
  deployer.deploy(Destructible);

  deployer.deploy(AddressSetLib);
  deployer.link(Destructible, AddressSetSpec);
  deployer.link(AddressSetLib, AddressSetSpec);
  deployer.deploy(AddressSetSpec);

  deployer.deploy(Bytes32SetLib);
  deployer.link(Destructible, Bytes32SetSpec);
  deployer.link(Bytes32SetLib, Bytes32SetSpec);
  deployer.deploy(Bytes32SetSpec);

  deployer.deploy(UIntSetLib);
  deployer.link(Destructible, UIntSetLib);
  deployer.link(UIntSetLib, UIntSetSpec);
  deployer.deploy(UIntSetSpec);

  deployer.deploy(EventStoreLib);

  deployer.link(EventStoreLib, EventStore);
  deployer.link(AddressSetLib, EventStore);
  deployer.link(Bytes32SetLib, EventStore);
  deployer.deploy(EventStore);

  deployer.link(EventStoreLib, EventStoreFactory);
  deployer.link(AddressSetLib, EventStoreFactory);
  deployer.link(Bytes32SetLib, EventStoreFactory);
  deployer.deploy(EventStoreFactory);


  deployer.link(EventStoreLib, PackageManager);
  deployer.link(AddressSetLib, PackageManager);
  deployer.link(Bytes32SetLib, PackageManager);
  deployer.link(EventStore, PackageManager);
  deployer.deploy(PackageManager);

};
