pragma solidity ^0.4.11;

import "../EventStore/EventStoreLib.sol";
import "../SetLib/Bytes32Set/Bytes32SetLib.sol";
import '../zeppelin/lifecycle/Killable.sol';

contract RBAC is Killable {

  using Bytes32SetLib for Bytes32SetLib.Bytes32Set;
  using EventStoreLib for EventStoreLib.EsEventStorage;

  EventStoreLib.EsEventStorage store;

  struct Grant {
    bytes32 role;
    bytes32 resource;
    bytes32 action;
    bytes32[] attributes;
  }

  Grant[] grants;

  Bytes32SetLib.Bytes32Set internalEventTypes;

  mapping(address => bytes32) addressRole;
  mapping(bytes32 => bool) isHashOfRoleActionResourceGranted;

  event DEBUG (
    bool test
  );

  // FALLBACK
  function () payable { throw; }
  
  // CONSTRUCTOR  
  function RBAC() payable {
    internalEventTypes.add(bytes32('AC_ROLE_ASSIGNED'));
    internalEventTypes.add(bytes32('AC_GRANT_WRITTEN'));
  }

  function eventCount() 
  returns (uint)
  {
    return store.events.length;
  }

   modifier canSetGrant(bytes32 resource, bytes32 action)
  {
    // only the owner can setGrants for the grant resource (no write up)
    // just because an account can setGrants does not mean they can give that ability to others...
    if (resource == 'grant') {
      require(tx.origin == owner);
    }
    if (tx.origin == owner) {
      _;
    } else {
      bytes32 role = addressRole[tx.origin];
      var (granted, _role, _resource) = canRoleActionResource(role, action, resource);
      // DEBUG(granted);
      if(granted){
        _;
      } else {
        throw;
      }
    }
    // throw;
    // require(tx.origin == owner);
    // _;
  }

  function setAddressRole(address target, bytes32 role)
  public
  onlyOwner
  {
    addressRole[target] = role;
    writeInternalEvent('AC_ROLE_ASSIGNED', 'A', 'X', bytes32(target), role);
  }

  function getAddressRole(address target)
  public
  returns (bytes32)
  {
    // if not the owner or the requesting address, do not return the role for the given address
    // EVENT SOURCING DESTOYS THIS PRIVACY
    // IS IT OK THAT ANY ADDRESS ROLE CAN BE KNOWN?
    require(tx.origin == owner || tx.origin == target);
    return addressRole[target];
  }
  
  function grantCount() 
  returns (uint)
  {
    return grants.length;
  }

  function setGrant(bytes32 role, bytes32 resource, bytes32 action, bytes32[] attributes)
    public
    canSetGrant(resource, action)
  {
    Grant memory grant;
    grant.role = role;
    grant.resource = resource;
    grant.action = action;
    grant.attributes = attributes;

    grants.push(grant);
    GrantEvent(role, resource, action, attributes);
    isHashOfRoleActionResourceGranted[keccak256(role, action, resource)] = attributes.length != 0;
    writeInternalEvent('AC_GRANT_WRITTEN', 'X', 'U', 'index', bytes32(grants.length-1));
  }

  function getGrant(uint index)
  returns (bytes32 role, bytes32 resource, bytes32 action, bytes32[] attributes)
  {
    Grant memory grant = grants[index];
    return (grant.role, grant.resource, grant.action, grant.attributes);
  }

  // The client interprets attributes = granted ? ['*'] : [] 
  // so no need to return a bytes32 array here...
  function canRoleActionResource(bytes32 role, bytes32 action, bytes32 resource)
  returns (bool granted, bytes32 _role, bytes32 _resource)
  {
    granted = isHashOfRoleActionResourceGranted[keccak256(role, action, resource)];
    _role = role;
    _resource = resource;
  }

  function writeInternalEvent(
    bytes32 _eventType, 
    bytes1 _keyType,
    bytes1 _valueType,
    bytes32 _key,
    bytes32 _value
  ) 
    internal 
    returns (uint)
  {
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

  event GrantEvent (
    bytes32 role, 
    bytes32 resource, 
    bytes32 action, 
    bytes32[] attributes
  );

}