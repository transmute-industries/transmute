pragma solidity ^0.4.11;

/// @title Library implementing an array type which allows O(1) lookups on values.
/// @author Piper Merriam <pipermerriam@gmail.com>, Eric Olszewski <eolszewski@gmail.com>
/// Adapted from https://github.com/ethpm/ethereum-indexed-enumerable-set-lib/blob/master/contracts/IndexedEnumerableSetLib.sol
library UIntSetLib {

  struct UIntSet {
    uint[] values;
    mapping(uint => bool) exists;
    mapping(uint => uint) indices;
  }

  modifier inBounds(UIntSet storage self, uint index) {
    require(index < self.values.length);
    _;
  }

  modifier notEmpty(UIntSet storage self) {
    require(self.values.length != 0);
    _;
  }

  function get(UIntSet storage self, uint index) public constant
    inBounds(self, index)
    returns (uint)
  {
    return self.values[index];
  }

  function set(UIntSet storage self, uint index, uint value) public
    inBounds(self, index)
    returns (bool)
  {
    if (self.exists[value])
      return false;
    self.values[index] = value;
    self.exists[value] = true;
    self.indices[value] = index;
    return true;
  }

  function add(UIntSet storage self, uint value) public
    returns (bool)
  {
    if (self.exists[value])
      return false;
    self.indices[value] = self.values.length;
    self.values.push(value);
    self.exists[value] = true;
    return true;
  }

  function remove(UIntSet storage self, uint value) public
    returns (bool)
  {
    if (!self.exists[value])
      return false;
    uint index = indexOf(self, value);
    pop(self, index);
    return true;
  }

  function pop(UIntSet storage self, uint index) public
    inBounds(self, index)
    returns (uint)
	{
    uint value = get(self, index);

    if (index != self.values.length - 1) {
      uint lastValue = last(self);
      self.exists[lastValue] = false;
      set(self, index, lastValue);
      self.indices[lastValue] = index;
    }
    self.values.length -= 1;

    delete self.indices[value];
    delete self.exists[value];

    return value;
  }

  function replace(UIntSet storage self, uint old, uint nu) public
    returns (bool)
  {
    return remove(self, old) && add(self, nu);
  }

  function first(UIntSet storage self) public constant
    notEmpty(self)
    returns (uint)
  {
    return get(self, 0);
  }

  function last(UIntSet storage self) public constant
    notEmpty(self)
    returns (uint)
  {
    return get(self, self.values.length - 1);
  }

  function indexOf(UIntSet storage self, uint value) public constant
    returns (uint)
  {
    if (!self.exists[value])
      return uint(-1);
    return self.indices[value];
  }

  function contains(UIntSet storage self, uint value) public constant
    returns (bool)
  {
    return self.exists[value];
  }

  function size(UIntSet storage self) public constant
    returns (uint)
  {
    return self.values.length;
  }
}
