pragma solidity ^0.4.11;

import "../node_modules/transmute-framework/contracts/TransmuteFramework/UnsafeEventStoreFactory.sol";

contract OracleFactory is UnsafeEventStoreFactory {

    function () public payable { revert(); }

    function OracleFactory() public payable {}

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
