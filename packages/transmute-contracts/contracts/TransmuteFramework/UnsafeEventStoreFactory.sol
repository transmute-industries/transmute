pragma solidity ^0.4.17;

import "./UnsafeEventStore.sol";
import "./SetLib/AddressSet/AddressSetLib.sol";

contract UnsafeEventStoreFactory is UnsafeEventStore {

  using AddressSetLib for AddressSetLib.AddressSet;

  mapping (address => AddressSetLib.AddressSet) creatorEventStoreMapping;
  AddressSetLib.AddressSet EventStoreAddresses;

  // Modifiers
  modifier checkExistence(address _EventStoreAddress) {
    require(EventStoreAddresses.contains(_EventStoreAddress));
    _;
  }

  // Fallback Function
  function () public payable { }

  // Constructor
  function UnsafeEventStoreFactory() public payable {}

  // Interface
	function createEventStore() public returns (address) {
		UnsafeEventStore newEventStore = new UnsafeEventStore();
    EventStoreAddresses.add(address(newEventStore));
    creatorEventStoreMapping[msg.sender].add(address(newEventStore));

    writeEvent("ES_CREATED", "S", "A", "address", bytes32(address(newEventStore)));
    return address(newEventStore);
	}

  function killEventStore(address _address) public checkExistence(_address) {
    
    UnsafeEventStore eventStore = UnsafeEventStore(_address);

    require(eventStore.owner() == msg.sender);

    creatorEventStoreMapping[eventStore.owner()].remove(_address);
    EventStoreAddresses.remove(_address);

    eventStore.destroy();
    writeEvent("ES_DESTROYED", "S", "A", "address", bytes32(_address));
  
  }

  // Helper Functions
  function getEventStoresByOwner() public view returns (address[]) {
    return creatorEventStoreMapping[msg.sender].values;
  }

  function getEventStores() public constant returns (address[]) {
    return EventStoreAddresses.values;
  }
}
