pragma solidity ^0.4.11;

import "./Oracle.sol";
import "../node_modules/transmute-framework/contracts/TransmuteFramework/SetLib/AddressSet/AddressSetLib.sol";
import "../node_modules/transmute-framework/contracts/TransmuteFramework/UnsafeEventStore.sol";

contract OracleFactory is UnsafeEventStore {

  using AddressSetLib for AddressSetLib.AddressSet;

  mapping (address => AddressSetLib.AddressSet) creatorEventStoreMapping;
  AddressSetLib.AddressSet childAddresses;

  // Fallback Function
  function () public payable { revert(); }

  // Constructor
  function OracleFactory() public
  payable
  {

  }


  // Modifiers
  modifier checkExistence(address _address)
  {
    require(childAddresses.contains(_address));
    _;
  }

  // Helper Functions
  function getEventStoresByCreator()
    public constant
    returns (address[])
  {
    return creatorEventStoreMapping[msg.sender].values;
  }

  function getEventStores()
    public constant
    returns (address[])
  {
    return childAddresses.values;
  }

  // Interface
	function createEventStore()
    public
    returns (address)
  {
    // Interact With Other Contracts
	Oracle _newEventStore = new Oracle();

    // Update State Dependent On Other Contracts
    childAddresses.add(address(_newEventStore));
    creatorEventStoreMapping[msg.sender].add(address(_newEventStore));

    writeEvent("ES_CREATED", "S", "A", "address", bytes32(address(_newEventStore)));

    return address(_newEventStore);
	}

  function killEventStore(address _address)
    public
    checkExistence(_address)
  {
    // Validate Local State - Only the Factory owner can destroy stores with this method
    require(this.owner() == msg.sender);

    UnsafeEventStore _eventStore = UnsafeEventStore(_address);

    // Update Local State
    creatorEventStoreMapping[_eventStore.owner()].remove(_address);
    childAddresses.remove(_address);

    _eventStore.kill();

    writeEvent("ES_DESTROYED", "S", "A", "address", bytes32(_address));
  }
}
