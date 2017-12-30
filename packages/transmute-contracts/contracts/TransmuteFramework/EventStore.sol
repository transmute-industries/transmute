pragma solidity ^0.4.17;

import "./EventStoreLib.sol";
import "./SetLib/AddressSet/AddressSetLib.sol";

// never inhertitence
contract EventStore {

  using EventStoreLib for EventStoreLib.EsEventStorage;
  using AddressSetLib for AddressSetLib.AddressSet;

  EventStoreLib.EsEventStorage store;
  AddressSetLib.AddressSet whitelist;

  address public creatorTxOrigin;
  address public owner;

  // Fallback Function
  function () public payable { revert(); }

  // Constuctor
  function EventStore() public payable {
    owner = msg.sender;
    creatorTxOrigin = tx.origin;
    writeEvent("OWNER_SET", "S", "A", "address", bytes32(address(owner)));
  }
  
  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public {
    require(newOwner != address(0));
    owner = newOwner;
    writeEvent("OWNER_SET", "S", "A", "address", bytes32(address(newOwner)));
  }

   /**
   * @dev Transfers the current balance to the owner and terminates the contract.
   */
  function destroy() public {
    require(msg.sender == owner);
    selfdestruct(owner);
  }

  function destroyAndSend(address _recipient) public {
    require(msg.sender == owner);
    selfdestruct(_recipient);
  }

  // Interface
  function writeEvent(
    bytes32 _eventType,
    bytes1 _keyType,
    bytes1 _valueType,
    bytes32 _key,
    bytes32 _value
  ) 
  public returns (uint)
  {
    // only this contract owner, creator, or a member of the whitelist can write events
    require(creatorTxOrigin == tx.origin || owner == msg.sender || whitelist.contains(msg.sender));
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

  // Helper Functions
  function setWhitelist(address[] _whitelist) public {
    require(msg.sender == owner);
    require(whitelist.size() == 0);
    for (uint index = 0; index < _whitelist.length; index++) {
      whitelist.add(_whitelist[index]);
    }
    writeEvent("WL_SET", "S", "A", "address", bytes32(address(msg.sender)));
  }

  function getWhitelist() public view returns(address[]) {
    return whitelist.values;
  }

  function eventCount() public view returns (uint) {
    return store.events.length;
  }

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
}
