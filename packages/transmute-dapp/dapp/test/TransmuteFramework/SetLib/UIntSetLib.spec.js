var Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
var UIntSetSpec = artifacts.require('./TransmuteFramework/SetLib/UIntSet/UIntSetSpec.sol')

contract('UIntSet', function (accounts) {

  var _uintSet = null
  var size = 0

  before(async function() {
    _uintSet = await UIntSetSpec.new();
  });

  it('test add, last', async () => {
    await _uintSet.add(0)
    ++size
    assert.equal((await _uintSet.last.call()).toNumber(), 0)
    await _uintSet.add(1)
    ++size
    assert.equal((await _uintSet.last.call()).toNumber(), 1)
    await _uintSet.add(2)
    ++size
    assert.equal((await _uintSet.last.call()).toNumber(), 2)
    await _uintSet.add(3)
    ++size
    assert.equal((await _uintSet.last.call()).toNumber(), 3)
    await _uintSet.add(4)
    ++size
    assert.equal((await _uintSet.last.call()).toNumber(), 4)
  })

  it('test indexOf', async () => {
    assert.equal(await _uintSet.indexOf.call(0), 0)
    assert.equal(await _uintSet.indexOf.call(1), 1)
    assert.equal(await _uintSet.indexOf.call(2), 2)
    assert.equal(await _uintSet.indexOf.call(3), 3)
    assert.equal(await _uintSet.indexOf.call(4), 4)
  })

  it('test remove, first', async () => {
    assert.equal((await _uintSet.first.call()).toNumber(), 0)
    await _uintSet.remove(0)
    --size
    assert.equal(await _uintSet.size.call(), size)
    assert.equal((await _uintSet.first.call()).toNumber(), 4)
    await _uintSet.remove(4)
    --size
    assert.equal(await _uintSet.size.call(), size)
    assert.equal((await _uintSet.first.call()).toNumber(), 3)
    await _uintSet.remove(3)
    --size
    assert.equal(await _uintSet.size.call(), size)
    assert.equal((await _uintSet.first.call()).toNumber(), 2)
    await _uintSet.remove(2)
    --size
    assert.equal(await _uintSet.size.call(), size)
    assert.equal((await _uintSet.first.call()).toNumber(), 1)
    await _uintSet.remove(1)
    --size
    assert.equal(await _uintSet.size.call(), size)
  })

  it('test add, remove, contains', async () => {
    await _uintSet.add(5)
    ++size
    await _uintSet.add(6)
    ++size
    await _uintSet.add(7)
    ++size
    await _uintSet.add(8)
    ++size
    await _uintSet.add(9)
    ++size
    assert.equal(await _uintSet.contains.call(5), true)
    assert.equal(await _uintSet.contains.call(6), true)
    assert.equal(await _uintSet.contains.call(7), true)
    assert.equal(await _uintSet.contains.call(8), true)
    assert.equal(await _uintSet.contains.call(9), true)
    await _uintSet.remove(9)
    --size
    await _uintSet.remove(8)
    --size
    await _uintSet.remove(7)
    --size
    assert.equal(await _uintSet.contains.call(7), false)
    assert.equal(await _uintSet.contains.call(8), false)
    assert.equal(await _uintSet.contains.call(9), false)
  })

  it('test get, set', async () => {
    await _uintSet.set(0, 0)
    assert.equal((await _uintSet.get.call(0)).toNumber(), 0)
    await _uintSet.set(1, 0)
    assert.equal((await _uintSet.get.call(1)).toNumber(), 6)
  })
})
