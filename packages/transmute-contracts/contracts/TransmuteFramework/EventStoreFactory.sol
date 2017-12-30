pragma solidity ^0.4.17;

import "./EventStoreLib.sol";
import "./EventStore.sol";
import "./SetLib/AddressSet/AddressSetLib.sol";

// never inherit or use modifiers!
contract EventStoreFactory {

  using EventStoreLib for EventStoreLib.EsEventStorage;
  using AddressSetLib for AddressSetLib.AddressSet;

  EventStoreLib.EsEventStorage store;
  AddressSetLib.AddressSet eventStores;

  address public owner;

  // Fallback Function
  function () public payable { revert(); }

  // Constuctor
  function EventStoreFactory() public payable {
    owner = msg.sender;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public {
    require(msg.sender == owner);
    require(newOwner != address(0));
    owner = newOwner;
    writeEvent("NEW_OWNER", "S", "A", "address", bytes32(address(newOwner)));
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
  function createEventStore(address[] _whitelist) public returns (address) {
    EventStore eventStore = new EventStore();
    writeEvent("ES_CREATED", "S", "A", "address", bytes32(address(eventStore)));
    eventStores.add(address(eventStore));

    eventStore.setWhitelist(_whitelist);
    eventStore.transferOwnership(msg.sender);
    
    return address(eventStore);
  }

  function getEventStores() public view returns (address[]) {
    return eventStores.values;
  }
  
  

  // writeEvent is private in factory
  // only the factory contract can write events
  // the factory event log should only be used to model factory events
  function writeEvent(
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

  function eventCount() 
  public view returns (uint) 
  {
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
