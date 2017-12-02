pragma solidity ^0.4.11;
import "./RBACEventStore.sol";
import "./RBAC.sol";
import "./SetLib/AddressSet/AddressSetLib.sol";

contract RBACEventStoreFactory is RBAC {
  using AddressSetLib for AddressSetLib.AddressSet;
  mapping (address => AddressSetLib.AddressSet) creatorEventStoreMapping;
  AddressSetLib.AddressSet storeAddresses;

  // Modifiers
  modifier checkExistence(address _EventStoreAddress) {
    require(storeAddresses.contains(_EventStoreAddress));
    _;
  }

  // Fallback Function
  function () public payable { revert(); }

  // Constructor
  function RBACEventStoreFactory() public payable {}

  // Interface
	function createEventStore() public returns (address) {
    bytes32 txOriginRole = getAddressRole(msg.sender);
    var (granted,,) = canRoleActionResource(txOriginRole, bytes32("create:any"), bytes32("eventstore"));

    if (msg.sender != owner && !granted)
      revert();

    RBACEventStore newEventStore = new RBACEventStore();
    storeAddresses.add(address(newEventStore));
    creatorEventStoreMapping[msg.sender].add(address(newEventStore));

    writeInternalEvent("ES_CREATED", "S", "A", "address", bytes32(address(newEventStore)));
    return address(newEventStore);
	}

  function killEventStore(address _address) public checkExistence(_address) {
    require(this.owner() == msg.sender);
    RBACEventStore eventStore = RBACEventStore(_address);

    creatorEventStoreMapping[eventStore.owner()].remove(_address);
    storeAddresses.remove(_address);
    eventStore.destroy();

    writeInternalEvent("ES_DESTROYED", "S", "A", "address", bytes32(_address));
  }

  // Helper Functions
  function getEventStoresByCreator() public view returns (address[]) {
    return creatorEventStoreMapping[msg.sender].values;
  }

  function getEventStores() public view returns (address[]) {
    return storeAddresses.values;
  }
}
