pragma solidity ^0.4.11;

import "./Oracle.sol";
import "../node_modules/transmute-framework/contracts/TransmuteFramework/SetLib/AddressSet/AddressSetLib.sol";
import "../node_modules/transmute-framework/contracts/TransmuteFramework/UnsafeEventStore.sol";

contract OracleFactory is UnsafeEventStore {

  using AddressSetLib for AddressSetLib.AddressSet;

  mapping (address => AddressSetLib.AddressSet) creatorOracleMapping;
  AddressSetLib.AddressSet childAddresses;

  // Modifiers
  modifier checkExistence(address _address)
  {
    require(childAddresses.contains(_address));
    _;
  }

  // Fallback Function
  function () public payable { revert(); }

  // Constructor
  function OracleFactory() public payable {}

  // Helper Functions
  function getOraclesByCreator() external view returns (address[]) {
    return creatorOracleMapping[msg.sender].values;
  }

  function getOracles() external view returns (address[]) {
    return childAddresses.values;
  }

  // Interface
	function createOracle() external returns (address) {
	  Oracle _newOracle = new Oracle();

    childAddresses.add(address(_newOracle));
    creatorOracleMapping[msg.sender].add(address(_newOracle));

    writeEvent("ES_CREATED", "S", "A", "address", bytes32(address(_newOracle)));

    return address(_newOracle);
	}

  function killOracle(address _address) external checkExistence(_address) {
    require(this.owner() == msg.sender);
    Oracle _oracle = Oracle(_address);

    creatorOracleMapping[_oracle.owner()].remove(_address);
    childAddresses.remove(_address);
    _oracle.kill();

    writeEvent("ES_DESTROYED", "S", "A", "address", bytes32(_address));
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
