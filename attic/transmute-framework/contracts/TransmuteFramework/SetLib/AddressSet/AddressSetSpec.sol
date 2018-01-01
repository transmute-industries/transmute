pragma solidity ^0.4.11;

import './AddressSetLib.sol';
import '../../Destructible.sol';

contract AddressSetSpec is Destructible {
  using AddressSetLib for AddressSetLib.AddressSet;

  AddressSetLib.AddressSet testSet;

  address public lastPop;
  bool public lastAdd;
  bool public lastRemove;

  function () public payable {}
  function AddressSetSpec() public payable {}

  function get(uint index) public view returns (address) {
    return testSet.get(index);
  }

  function getValues() public view returns (address[]) {
    return testSet.values;
  }

  function set(uint index, address value) public returns (bool) {
    return testSet.set(index, value);
  }

  function add(address value) public returns (bool) {
    lastAdd = testSet.add(value);
    return lastAdd;
  }

  function remove(address value) public returns (bool) {
    lastRemove = testSet.remove(value);
    return lastRemove;
  }

  function pop(uint index) public returns (address) {
    lastPop = testSet.pop(index);
    return lastPop;
  }

  function first() public view returns (address) {
    return testSet.first();
  }

  function last() public view returns (address) {
    return testSet.last();
  }

  function indexOf(address value) public view returns (uint) {
    return testSet.indexOf(value);
  }

  function contains(address value) public view returns (bool) {
    return testSet.contains(value);
  }

  function size() public view returns (uint) {
    return testSet.size();
  }
}
