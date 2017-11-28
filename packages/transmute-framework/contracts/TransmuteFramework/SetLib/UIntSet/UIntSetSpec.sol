pragma solidity ^0.4.11;

import './UIntSetLib.sol';
import '../../Killable.sol';

contract UIntSetSpec is Killable {
  using UIntSetLib for UIntSetLib.UIntSet;

  UIntSetLib.UIntSet testSet;

  uint public lastPop;
  bool public lastAdd;
  bool public lastRemove;

  function () public payable {}
  function UIntSetSpec() public payable {}

  function get(uint index) public view returns (uint) {
    return testSet.get(index);
  }

  function getValues() public view returns (uint[]) {
    return testSet.values;
  }

  function set(uint index, uint value) public returns (bool) {
    return testSet.set(index, value);
  }

  function add(uint value) public returns (bool) {
    lastAdd = testSet.add(value);
    return lastAdd;
  }

  function remove(uint value) public returns (bool) {
    lastRemove = testSet.remove(value);
    return lastRemove;
  }

  function pop(uint index) public returns (uint) {
    lastPop = testSet.pop(index);
    return lastPop;
  }

  function first() public view returns (uint) {
    return testSet.first();
  }

  function last() public view returns (uint) {
    return testSet.last();
  }

  function indexOf(uint value) public view returns (uint) {
    return testSet.indexOf(value);
  }

  function contains(uint value) public view returns (bool) {
    return testSet.contains(value);
  }

  function size() public view returns (uint) {
    return testSet.size();
  }
}
