pragma solidity ^0.4.11;

import "../node_modules/transmute-framework/contracts/TransmuteFramework/UnsafeEventStore.sol";

contract PackageManager is UnsafeEventStore {

  // FALLBACK
  function () public payable { revert(); }
  
  // CONSTRUCTOR  
  function PackageManager() public payable {}

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