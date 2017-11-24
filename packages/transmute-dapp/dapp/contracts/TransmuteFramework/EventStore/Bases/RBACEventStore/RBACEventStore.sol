pragma solidity ^0.4.11;

import '../../../zeppelin/lifecycle/Killable.sol';
import '../../../Security/RBAC.sol';

contract RBACEventStore is RBAC {

  // FALLBACK
  function () payable { throw; }
  
  // CONSTRUCTOR  
  function RBACEventStore() payable {
    owner = tx.origin;
  }

  function eventCount() 
  returns (uint)
  {
    return store.events.length;
  }

  function writeEvent(
    bytes32 _eventType, 
    bytes1 _keyType,
    bytes1 _valueType,
    bytes32 _key,
    bytes32 _value
  ) 
    public 
    returns (uint)
  {
    // Check access control here before writing events...
    bytes32 txOriginRole = getAddressRole(tx.origin);
    var (granted,,) = canRoleActionResource(txOriginRole, bytes32("create:any"), bytes32("event"));
    if (tx.origin != owner && !granted){
      throw;
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

  // READ EVENT
  function readEvent(uint _eventId) 
    public 
    returns (
      uint, 
      address, 
      uint, 
      bytes32, 
      bytes1,
      bytes1,
      bytes32,
      bytes32
    )
  {
    return EventStoreLib.readEvent(store, _eventId);
  }

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