pragma solidity ^0.4.11;

/// @title Library implementing an array type which allows O(1) lookups on values.
/// @author Piper Merriam <pipermerriam@gmail.com>, Eric Olszewski <eolszewski@gmail.com>
/// Adapted from https://github.com/ethpm/ethereum-indexed-enumerable-set-lib/blob/master/contracts/IndexedEnumerableSetLib.sol
library AddressSetLib {

  struct AddressSet {
    address[] values;
    mapping(address => bool) exists;
    mapping(address => uint) indices;
  }

  modifier inBounds(AddressSet storage self, uint index) {
    require(index < self.values.length);
    _;
  }

  modifier notEmpty(AddressSet storage self) {
    require(self.values.length != 0);
    _;
  }

  function get(AddressSet storage self, uint index) public constant
    inBounds(self, index)
    returns (address)
  {
    return self.values[index];
  }

  function set(AddressSet storage self, uint index, address value) public
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

  function add(AddressSet storage self, address value) public
    returns (bool)
  {
    if (self.exists[value])
      return false;
    self.indices[value] = self.values.length;
    self.values.push(value);
    self.exists[value] = true;
    return true;
  }

  function remove(AddressSet storage self, address value) public
    returns (bool)
  {
    if (!self.exists[value])
      return false;
    uint index = indexOf(self, value);
    pop(self, index);
    return true;
  }

  function pop(AddressSet storage self, uint index) public
    inBounds(self, index)
    returns (address)
	{
    address value = get(self, index);

    if (index != self.values.length - 1) {
      address lastValue = last(self);
      self.exists[lastValue] = false;
      set(self, index, lastValue);
      self.indices[lastValue] = index;
    }
    self.values.length -= 1;

    delete self.indices[value];
    delete self.exists[value];

    return value;
  }

  function replace(AddressSet storage self, address old, address nu) public
    returns (bool)
  {
    return remove(self, old) && add(self, nu);
  }

  function first(AddressSet storage self) public constant
    notEmpty(self)
    returns (address)
  {
    return get(self, 0);
  }

  function last(AddressSet storage self) public constant
    notEmpty(self)
    returns (address)
  {
    return get(self, self.values.length - 1);
  }

  function indexOf(AddressSet storage self, address value) public constant
    returns (uint)
  {
    if (!self.exists[value])
      return uint(-1);
    return self.indices[value];
  }

  function contains(AddressSet storage self, address value) public constant
    returns (bool)
  {
    return self.exists[value];
  }

  function size(AddressSet storage self) public constant
    returns (uint)
  {
    return self.values.length;
  }
}
