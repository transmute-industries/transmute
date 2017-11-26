pragma solidity ^0.4.11;

import "../node_modules/transmute-framework/contracts/TransmuteFramework/UnsafeEventStore.sol";

contract Oracle is UnsafeEventStore {

  // FALLBACK
  function () public payable { revert(); }
  
  // CONSTRUCTOR  
  function Oracle() public payable {}

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

  struct OracleTransaction {
    bytes32 guid;
    address callerAddress;
    bytes32 callerRequest;
    bytes32 callerCallback;

    bytes32 oracleResponse; 
  }

  mapping (bytes32 => OracleTransaction) transactions;

  // function register(address _address, string _text) public returns (bool) {
  //     return _address.call(bytes4(keccak256("register(string)")), _text);
  // }

  function getTransactionByGuid(bytes32 _guid) public view returns (bytes32, address, bytes32, bytes32, bytes32) {
    OracleTransaction storage ot = transactions[_guid];
    return (ot.guid, ot.callerAddress, ot.callerRequest, ot.callerCallback, ot.oracleResponse);
  }

  function requestBytes32(bytes32 _guid, bytes32 _request, bytes32 _callback) public {
    OracleTransaction memory ot;
    ot.guid = _guid;
    ot.callerAddress = msg.sender;
    ot.callerRequest = _request;
    ot.callerCallback = _callback;
    transactions[_guid] = ot;
    writeEvent("REQUEST", "S", "B", "guid", _guid);
  }

  function respondBytes32(bytes32 _guid, bytes32 _data) public {
    OracleTransaction storage ot = transactions[_guid];
    ot.oracleResponse = _data;

    if (! ot.callerAddress.call(bytes4(keccak256("receive(bytes32)")), _data)) {
      revert();
    }
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