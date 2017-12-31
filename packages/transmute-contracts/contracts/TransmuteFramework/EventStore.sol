pragma solidity ^0.4.17;

import "./EventStoreLib.sol";
import "./SetLib/AddressSet/AddressSetLib.sol";
import "./SetLib/Bytes32Set/Bytes32SetLib.sol";

// never inhertitence
contract EventStore {

  using EventStoreLib for EventStoreLib.EsEventStorage;
  using AddressSetLib for AddressSetLib.AddressSet;
  using Bytes32SetLib for Bytes32SetLib.Bytes32Set;

  // Events
  event EsEvent(
    uint Id,
    address TxOrigin,
    address MsgSender,
    uint Created,

    bytes32 EventType,

    bytes1 KeyType,
    bytes1 ValueType,

    bytes32 Key,
    bytes32 Value
  );

  // TODO: Add security CHECKS!!!!
  bytes32 private constant NEW_OWNER = bytes32("NEW_OWNER");
  bytes32 private constant RECYCLED_TO = bytes32("RECYCLED_TO");
  bytes32 private constant WL_SET = bytes32("WL_SET");

  Bytes32SetLib.Bytes32Set private INTERNAL_EVENT_TYPES;

  EventStoreLib.EsEventStorage store;
  AddressSetLib.AddressSet whitelist;

  address public owner;

  /**
   * @dev This contract can receive ether.
   */
  function () public payable { }

  // Constuctor
  function EventStore() public payable {
    owner = msg.sender;

    INTERNAL_EVENT_TYPES.add(NEW_OWNER);
    INTERNAL_EVENT_TYPES.add(RECYCLED_TO);
    INTERNAL_EVENT_TYPES.add(WL_SET);

    internalWriteEvent(NEW_OWNER, "S", "A", "address", bytes32(address(owner)));
  }
  
  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public {
    require(msg.sender == owner);
    require(newOwner != address(0));
    owner = newOwner;
    internalWriteEvent(NEW_OWNER, "S", "A", "address", bytes32(address(newOwner)));
  }

   /**
   * @dev Transfers the current balance to the owner and terminates the contract.
   */
  function recycle() public {
    require(msg.sender == owner);
    internalWriteEvent(RECYCLED_TO, "S", "A", "address", bytes32(address(owner)));
    selfdestruct(owner);
  }

  /**
   * @dev Allows the current owner to transfer balance to recipient and terminates the contract.
   * @param _recipient The address to transfer balance to.
   */
  function recycleAndSend(address _recipient) public {
    require(msg.sender == owner);
    internalWriteEvent(RECYCLED_TO, "S", "A", "address", bytes32(address(_recipient)));
    selfdestruct(_recipient);
  }

  /**
  * @dev internalWriteEvent is private, CAREFUL you need to make sure that whitelisted and owner accounts cannot use internalEventTypes!!!!!!
  * @param _eventType The type of this event
  * @param _keyType The type of this event's key
  * @param _valueType The type of this event's value
  * @param _key This event's key
  * @param _value This event's value
  */
  function internalWriteEvent(
    bytes32 _eventType,
    bytes1 _keyType,
    bytes1 _valueType,
    bytes32 _key,
    bytes32 _value
  ) 
  private returns (uint)
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

  /**
  * @dev writeEvent CAREFUL you need to make sure that whitelisted and owner accounts cannot use internalEventTypes!!!!!!
  * @param _eventType The type of this event
  * @param _keyType The type of this event's key
  * @param _valueType The type of this event's value
  * @param _key This event's key
  * @param _value This event's value
  */
  function writeEvent(
    bytes32 _eventType,
    bytes1 _keyType,
    bytes1 _valueType,
    bytes32 _key,
    bytes32 _value
  ) 
  public returns (uint)
  {
    // only this contract owner or a member of the whitelist can write events
    require(owner == msg.sender || whitelist.contains(msg.sender));
    return EventStoreLib.writeEvent(
      store,
      _eventType,
      _keyType,
      _valueType,
      _key,
      _value
    );
  }

  function readEvent(uint _eventId) 
  public view
    returns (
      uint,
      address,
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

  /**
   * @dev Allows the current owner to set the whitelist EXACTLY ONCE
   * @param _whitelist The addresses which can use the public writeEvent method of this contract.
   */
  function setWhitelist(address[] _whitelist) public {
    require(msg.sender == owner);
    require(whitelist.size() == 0);
    for (uint index = 0; index < _whitelist.length; index++) {
      whitelist.add(_whitelist[index]);
    }
    internalWriteEvent(WL_SET, "S", "A", "address", bytes32(address(msg.sender)));
  }

  function getWhitelist() public view returns(address[]) {
    return whitelist.values;
  }

  function eventCount() public view returns (uint) {
    return store.events.length;
  }

  function getInternalEventTypes() public view returns (bytes32[]) {
    return INTERNAL_EVENT_TYPES.values;
  }

  
}
