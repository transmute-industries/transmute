pragma solidity ^0.4.11;
import "./RBACEventStore.sol";
import '../../../Security/RBAC.sol';
import "../../../SetLib/AddressSet/AddressSetLib.sol";

contract RBACEventStoreFactory is RBAC {
  using AddressSetLib for AddressSetLib.AddressSet;
  mapping (address => AddressSetLib.AddressSet) creatorEventStoreMapping;
  AddressSetLib.AddressSet storeAddresses;

  // Fallback Function
  function () payable { throw; }

  // Constructor
  function RBACEventStoreFactory()
  payable
  {

  }

  function eventCount() 
  public
  returns (uint)
  {
    return store.events.length;
  }

  function debug() 
  public
    returns (uint)
  {
    return 0;
  }
  

  // Modifiers
  modifier checkExistence(address _EventStoreAddress)
  {
    require(storeAddresses.contains(_EventStoreAddress));
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
    return storeAddresses.values;
  }

  // Interface
	function createEventStore()
    public
    returns (address)
  {
    bytes32 txOriginRole = getAddressRole(msg.sender);

    var (granted,,) = canRoleActionResource(txOriginRole, bytes32("create:any"), bytes32("eventstore"));

    if (msg.sender != owner && !granted){
      throw;
    }
    // Interact With Other Contracts
    RBACEventStore _newEventStore = new RBACEventStore();

    // Update State Dependent On Other Contracts
    storeAddresses.add(address(_newEventStore));
    creatorEventStoreMapping[msg.sender].add(address(_newEventStore));

    writeInternalEvent('ES_CREATED', 'X', 'A', 'address', bytes32(address(_newEventStore)));

    return address(_newEventStore);
    
	}


  function killEventStore(address _address)
    public
    checkExistence(_address)
  {
    // Validate Local State - Only the Factory owner can destroy stores with this method
    require(this.owner() == msg.sender);

    RBACEventStore _eventStore = RBACEventStore(_address);

    // Update Local State
    creatorEventStoreMapping[_eventStore.owner()].remove(_address);
    storeAddresses.remove(_address);

    _eventStore.kill();

    writeInternalEvent('ES_DESTROYED', 'X', 'A', 'address', bytes32(_address));
  }
}
