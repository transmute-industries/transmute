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
  }
  
  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

   // Modifiers
  modifier onlyWhitelist(address _caller) {
    require(whitelist.contains(_caller));
    _;
  }

  modifier onlyCreatorOrOwner(address _caller) {
    require(_caller == this.owner() || _caller == this.creatorTxOrigin());
    _;
  }

  modifier onlyWhitelistOrOwner(address _caller) {
    require(whitelist.contains(_caller) || _caller == this.owner() || _caller == this.creatorTxOrigin());
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public {
    require(newOwner != address(0));
    owner = newOwner;
    writeEvent("ES_OWNER", "S", "A", "address", bytes32(address(newOwner)));
  }

   /**
   * @dev Transfers the current balance to the owner and terminates the contract.
   */
  function destroy() onlyOwner public {
    selfdestruct(owner);
  }

  function destroyAndSend(address _recipient) onlyOwner public {
    selfdestruct(_recipient);
  }

  // Interface
  function writeEvent(
    bytes32 _eventType,
    bytes1 _keyType,
    bytes1 _valueType,
    bytes32 _key,
    bytes32 _value
  ) public returns (uint) {
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
    writeEvent("ES_WL_SET", "S", "A", "address", bytes32(address(msg.sender)));
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
    address MsgSender,
    uint Created,

    bytes32 EventType,

    bytes1 KeyType,
    bytes1 ValueType,

    bytes32 Key,
    bytes32 Value
  );
}
