pragma solidity ^0.4.11;

import "./Oracle.sol";

contract OracleCaller {

  bytes32 public state;
  // bytes32 requestIndex = ;
  // FALLBACK
  function () public { revert(); }
  
  // CONSTRUCTOR  
  function OracleCaller() public {
  }

  event CallerState(
    bytes32 data
  );

  function trigger(address oracleAddress) public {
      Oracle orc = Oracle(oracleAddress);
      bytes32 guid = keccak256(block.number);
      bytes32 request = bytes32("Math.random()");
      bytes32 callback = bytes32("receive(bytes32)");
      orc.requestBytes32(guid, request, callback);
  }

  function receive(bytes32 data) public {
      state = data;
  }

  function check() public {
      CallerState(state);
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