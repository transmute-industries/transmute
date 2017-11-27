pragma solidity ^0.4.11;

import "./Oracle.sol";
import "../node_modules/transmute-framework/contracts/TransmuteFramework/SetLib/AddressSet/AddressSetLib.sol";

contract OracleCaller {
  
  using AddressSetLib for AddressSetLib.AddressSet;

  Oracle oracle;
  AddressSetLib.AddressSet whitelist;
  bytes32 public state;

  // Modifiers
  modifier onlyWhitelist(address _caller) {
    require(whitelist.contains(_caller));
    _;
  }
  
  // Fallback Function
  function () public { revert(); }
  
  // Constructor
  function OracleCaller(address _oracleAddress, address[] _whitelist) public {
    oracle = Oracle(_oracleAddress);
    for (uint index = 0; index < _whitelist.length; index++) {
      whitelist.add(_whitelist[index]);
    }
  }

  function trigger() external onlyWhitelist(msg.sender) {
    bytes32 guid = keccak256(block.number);
    bytes32 request = bytes32("Math.random()");
    oracle.requestBytes32(guid, request, this.receive);
  }

  function receive(bytes32 _data) external {
    require(msg.sender == address(oracle));
    state = _data;
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