pragma solidity ^0.4.11;

import "../node_modules/transmute-framework/contracts/TransmuteFramework/UnsafeEventStore.sol";

contract Oracle is UnsafeEventStore {

  // Think about standards...
  // http://www.jsonrpc.org/specification
  // struct RequestObject {
  //   bytes32 jsonrpc;
  //   bytes32 method;
  //   bytes32 params;
  //   bytes32 id;
  // }

  // struct ResponseObject {
  //   bytes32 jsonrpc;
  //   bytes32 result;
  //   bytes32 error;
  //   bytes32 id;
  // }

  // Modifiers
  modifier transactionDoesNotExist(bytes32 _guid) {
    OracleTransaction storage ot = transactions[_guid];
    require(ot.callerAddress == address(0));
    _;
  }

  // Fallback Function
  function () public payable { revert(); }
  
  // Constructor
  function Oracle() public payable {}

  struct OracleTransaction {
    bytes32 guid;
    address callerAddress;
    bytes32 callerRequest;
    function(bytes32) external callerCallback;

    bytes32 oracleResponse; 
  }

  mapping (bytes32 => OracleTransaction) transactions;

  function getTransactionByGuid(bytes32 _guid) external view returns (bytes32, address, bytes32, bytes32) {
    OracleTransaction storage ot = transactions[_guid];
    require(ot.callerAddress != address(0));
    return (ot.guid, ot.callerAddress, ot.callerRequest, ot.oracleResponse);
  }

  function requestBytes32(bytes32 _guid, bytes32 _request, function(bytes32) external _callback) external transactionDoesNotExist(_guid) {
    OracleTransaction memory ot;
    ot.guid = _guid;
    ot.callerAddress = msg.sender;
    ot.callerRequest = _request;
    ot.callerCallback = _callback;
    transactions[_guid] = ot;
    writeEvent("REQUEST", "S", "B", "guid", _guid);
  }

  function respondBytes32(bytes32 _guid, bytes32 _data) external {
    OracleTransaction storage ot = transactions[_guid];
    ot.oracleResponse = _data;

    ot.callerCallback(_data);

    writeEvent("RESPONSE", "S", "B", "guid", _guid);
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