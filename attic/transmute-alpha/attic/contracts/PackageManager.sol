pragma solidity ^0.4.11;

import "transmute-contracts/contracts/TransmuteFramework/EventStore.sol";

contract PackageManager is EventStore {

  // FALLBACK
  function () public payable { revert(); }
  
  // CONSTRUCTOR  
  function PackageManager() public payable {}

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