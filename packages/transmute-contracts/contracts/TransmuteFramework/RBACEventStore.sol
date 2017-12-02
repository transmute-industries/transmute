pragma solidity ^0.4.17;

import './Destructible.sol';
import './RBAC.sol';

contract RBACEventStore is RBAC {

  // Fallback Function
  function () public payable { revert(); }

  // Constructor
  function RBACEventStore() public payable {
    owner = tx.origin;
  }

  // Interface
  function writeEvent(
    bytes32 _eventType,
    bytes1 _keyType,
    bytes1 _valueType,
    bytes32 _key,
    bytes32 _value
  ) public returns (uint) {
    bytes32 txOriginRole = getAddressRole(msg.sender);
    var (granted,,) = canRoleActionResource(txOriginRole, bytes32("create:any"), bytes32("event"));

    if (msg.sender != owner && !granted) {
      revert();
    }

    return EventStoreLib.writeEvent(
      store,
      _eventType,
      _keyType,
      _valueType,
      _key,
      _value
    );
  }

  function readEvent(uint _eventId) public view
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
