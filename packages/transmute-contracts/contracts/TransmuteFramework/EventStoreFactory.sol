pragma solidity ^0.4.17;

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
  function EventStoreFactory() public payable { }

  // Interface
  function createEventStore() public returns (address) {
    EventStore newEventStore = new EventStore();

    EventStoreAddresses.add(address(newEventStore));
    creatorEventStoreMapping[msg.sender].add(address(newEventStore));

    writeEvent("ES_CREATED", "S", "A", "address", bytes32(address(newEventStore)));
    return address(newEventStore);
  }

  function setEventStoreWhitelist(address _eventStoreAddress, address[] _whitelist) public eventStoreExists(_eventStoreAddress) {
    EventStore eventStore = EventStore(_eventStoreAddress);
    require(eventStore.creator() == msg.sender);

    eventStore.setWhitelist(_whitelist);

    writeEvent("ES_WL_SET", "S", "A", "address", bytes32(address(_eventStoreAddress)));
  }

  function killEventStore(address _eventStoreAddress) public eventStoreExists(_eventStoreAddress) {
    EventStore eventStore = EventStore(_eventStoreAddress);
    require(eventStore.creator() == msg.sender);
    creatorEventStoreMapping[eventStore.owner()].remove(_eventStoreAddress);
    EventStoreAddresses.remove(_eventStoreAddress);

    eventStore.destroy();
    writeEvent("ES_DESTROYED", "S", "A", "address", bytes32(_eventStoreAddress));
  }

  // Helper Functions
  function getEventStoresByCreator() public view returns (address[]) {
    return creatorEventStoreMapping[msg.sender].values;
  }

  function getEventStores() public view returns (address[]) {
    return EventStoreAddresses.values;
  }
}
