pragma solidity ^0.4.17;

import './Bytes32SetLib.sol';
import '../../Destructible.sol';

contract Bytes32SetSpec is Destructible {
  using Bytes32SetLib for Bytes32SetLib.Bytes32Set;

  Bytes32SetLib.Bytes32Set testSet;

  bytes32 public lastPop;
  bool public lastAdd;
  bool public lastRemove;

  function () public payable {}
  function Bytes32SetSpec() public payable {}

  function get(uint index) public view returns (bytes32) {
    return testSet.get(index);
  }

  function getValues() public view returns (bytes32[]) {
    return testSet.values;
  }

  function set(uint index, bytes32 value) public returns (bool) {
    return testSet.set(index, value);
  }

  function add(bytes32 value) public returns (bool) {
    lastAdd = testSet.add(value);
    return lastAdd;
  }

  function remove(bytes32 value) public returns (bool) {
    lastRemove = testSet.remove(value);
    return lastRemove;
  }

  function pop(uint index) public returns (bytes32) {
    lastPop = testSet.pop(index);
    return lastPop;
  }

  function first() public view returns (bytes32) {
    return testSet.first();
  }

  function last() public view returns (bytes32) {
    return testSet.last();
  }

  function indexOf(bytes32 value) public view returns (uint) {
    return testSet.indexOf(value);
  }

  function contains(bytes32 value) public view returns (bool) {
    return testSet.contains(value);
  }

  function size() public view returns (uint) {
    return testSet.size();
  }
}
