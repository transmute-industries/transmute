pragma solidity ^0.4.11;

import './UIntSetLib.sol';
import '../../zeppelin/lifecycle/Killable.sol';

contract UIntSetSpec is Killable {
  using UIntSetLib for UIntSetLib.UIntSet;

  UIntSetLib.UIntSet testSet;

  uint public lastPop;
  bool public lastAdd;
  bool public lastRemove;

  function () payable {}
  function UIntSetSpec() payable {}

  function get(uint index) public constant
    returns (uint)
  {
    return testSet.get(index);
  }

  function getValues() public constant
    returns (uint[])
  {
    return testSet.values;
  }

  function set(uint index, uint value) public
    returns (bool)
  {
    return testSet.set(index, value);
  }

  function add(uint value) public
    returns (bool)
  {
    lastAdd = testSet.add(value);
    return lastAdd;
  }

  function remove(uint value) public
    returns (bool)
  {
    lastRemove = testSet.remove(value);
    return lastRemove;
  }

  function pop(uint index) public
    returns (uint)
  {
    lastPop = testSet.pop(index);
    return lastPop;
  }

  function first() public constant
    returns (uint)
  {
    return testSet.first();
  }

  function last() public constant
    returns (uint)
  {
    return testSet.last();
  }

  function indexOf(uint value) public constant
    returns (uint)
  {
    return testSet.indexOf(value);
  }

  function contains(uint value) public constant
    returns (bool)
  {
    return testSet.contains(value);
  }

  function size() public constant
    returns (uint)
  {
    return testSet.size();
  }
}
