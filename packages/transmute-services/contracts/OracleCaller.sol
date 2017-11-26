pragma solidity ^0.4.11;

import "./Oracle.sol";

contract OracleCaller {


  // FALLBACK
  function () public { revert(); }
  
  // CONSTRUCTOR  
  function OracleCaller() public {
  }

  event OracleRequest(
    bytes32 data
  );

  function callOracle(address oracleAddress) public {
      // Oracle orc = Oracle(oracleAddress);
      // bytes32 requestIndex = keccak256(0x616263);
      // 0x4e03657aea45a94fc7d47ba826c8d667c0d1e6e33a64a036ec44f58fa12d6c45

      // bytes32 data = orc.testData();

      // 

      OracleRequest(
        bytes32("bob")
      );
  
  }

}