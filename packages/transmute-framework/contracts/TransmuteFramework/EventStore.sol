pragma solidity ^0.4.11;

import "./EventStoreLib.sol";
import './Destructible.sol';
import "./SetLib/AddressSet/AddressSetLib.sol";

contract EventStore is Destructible {

  using EventStoreLib for EventStoreLib.EsEventStorage;
  using AddressSetLib for AddressSetLib.AddressSet;

  EventStoreLib.EsEventStorage store;
  AddressSetLib.AddressSet whitelist;
  address public creator;

  // Modifiers
  modifier onlyWhitelist(address _caller) {
    require(whitelist.contains(_caller));
    _;
  }

  modifier onlyCreatorOrOwner(address _caller) {
    require(_caller == this.owner() || _caller == creator);
    _;
  }

  // Fallback Function
  function () public payable { revert(); }

  // Constuctor
  function EventStore() public payable {
    creator = tx.origin;
  }

  // Interface
  function writeEvent(
    bytes32 _eventType,
    bytes1 _keyType,
    bytes1 _valueType,
    bytes32 _key,
    bytes32 _value
  ) public onlyWhitelist(msg.sender) returns (uint) {
    return EventStoreLib.writeEvent(
      store,
      _eventType,
      _keyType,
      _valueType,
      _key,
      _value
    );
  }

  function readEvent(uint _eventId) public view onlyWhitelist(msg.sender)
    returns (
      uint,
      address,
      uint,
      bytes32,
      bytes1,
      bytes1,
      bytes32,
      bytes32
    ) {
    return EventStoreLib.readEvent(store, _eventId);
  }

  // Helper Functions
  function setWhitelist(address[] _whitelist) public onlyCreatorOrOwner(msg.sender) {
    require(whitelist.size() == 0);
    for (uint index = 0; index < _whitelist.length; index++) {
      whitelist.add(_whitelist[index]);
    }
  }

  function getWhitelist() public view onlyCreatorOrOwner(msg.sender) returns(address[]) {
    return whitelist.values;
  }

  function eventCount() public view returns (uint) {
    return store.events.length;
  }

  // Events
  event EsEvent(
    uint Id,
    address TxOrigin,
    uint Created,

    bytes32 EventType,

    bytes1 KeyType,
    bytes1 ValueType,

    bytes32 Key,
    bytes32 Value
  );
}
