pragma solidity ^0.4.11;

import "./EventStore.sol";
import "./SetLib/AddressSet/AddressSetLib.sol";

contract EventStoreFactory is EventStore {

  using AddressSetLib for AddressSetLib.AddressSet;

  mapping (address => AddressSetLib.AddressSet) creatorEventStoreMapping;
  AddressSetLib.AddressSet EventStoreAddresses;

  // Modifiers
  modifier eventStoreExists(address _eventStoreAddress) {
    require(EventStoreAddresses.contains(_eventStoreAddress));
    _;
  }

  // Fallback Function
  function () public payable { revert(); }

  // Constructor
  function EventStoreFactory() public payable {}

  // Interface
	function createEventStore(address[] _whitelist) public returns (address) {
		EventStore newEventStore = new EventStore(_whitelist);
    EventStoreAddresses.add(address(newEventStore));
    creatorEventStoreMapping[msg.sender].add(address(newEventStore));

    writeEvent("ES_CREATED", "S", "A", "address", bytes32(address(newEventStore)));
    return address(newEventStore);
	}

  function killEventStore(address _address) public eventStoreExists(_address) {
    EventStore eventStore = EventStore(_address);
    require(this.owner() == msg.sender || eventStore.owner() == msg.sender);
    creatorEventStoreMapping[eventStore.owner()].remove(_address);
    EventStoreAddresses.remove(_address);

    eventStore.kill();
    writeEvent("ES_DESTROYED", "S", "A", "address", bytes32(_address));
  }

  // Helper Functions
  function getEventStoresByCreator() public view returns (address[]) {
    return creatorEventStoreMapping[msg.sender].values;
  }

  function getEventStores() public view returns (address[]) {
    return EventStoreAddresses.values;
  }
}
