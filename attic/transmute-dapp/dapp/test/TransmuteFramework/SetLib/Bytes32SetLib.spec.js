var Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
var Bytes32SetSpec = artifacts.require('./TransmuteFramework/SetLib/Bytes32Set/Bytes32SetSpec.sol')

contract('bytes32Set', function(accounts) {

  let _bytes32Set;
  let size = 0

  function toAscii(value) {
    return web3.toAscii(value).replace(/\u0000/g, '')
  }

  before(async function() {
    _bytes32Set = await Bytes32SetSpec.new();
  });

  it('test add, last', async () => {
    await _bytes32Set.add('A')
    ++size
    assert.equal(toAscii((await _bytes32Set.last.call())), 'A')
    await _bytes32Set.add('B')
    ++size
    assert.equal(toAscii((await _bytes32Set.last.call())), 'B')
    await _bytes32Set.add('C')
    ++size
    assert.equal(toAscii((await _bytes32Set.last.call())), 'C')
    await _bytes32Set.add('D')
    ++size
    assert.equal(toAscii((await _bytes32Set.last.call())), 'D')
    await _bytes32Set.add('E')
    ++size
    assert.equal(toAscii((await _bytes32Set.last.call())), 'E')
  })

  it('test indexOf', async () => {
    assert.equal(await _bytes32Set.indexOf.call('A'), 0)
    assert.equal(await _bytes32Set.indexOf.call('B'), 1)
    assert.equal(await _bytes32Set.indexOf.call('C'), 2)
    assert.equal(await _bytes32Set.indexOf.call('D'), 3)
    assert.equal(await _bytes32Set.indexOf.call('E'), 4)
  })

  it('test remove, first', async () => {
    assert.equal(toAscii((await _bytes32Set.first.call())), 'A')
    await _bytes32Set.remove('A')
    --size
    assert.equal(await _bytes32Set.size.call(), size)
    assert.equal(toAscii((await _bytes32Set.first.call())), 'E')
    await _bytes32Set.remove('E')
    --size
    assert.equal(await _bytes32Set.size.call(), size)
    assert.equal(toAscii((await _bytes32Set.first.call())), 'D')
    await _bytes32Set.remove('D')
    --size
    assert.equal(await _bytes32Set.size.call(), size)
    assert.equal(toAscii((await _bytes32Set.first.call())), 'C')
    await _bytes32Set.remove('C')
    --size
    assert.equal(await _bytes32Set.size.call(), size)
    assert.equal(toAscii((await _bytes32Set.first.call())), 'B')
    await _bytes32Set.remove('B')
    --size
    assert.equal(await _bytes32Set.size.call(), size)
  })

  it('test add, remove, contains', async () => {
    await _bytes32Set.add('F')
    ++size
    await _bytes32Set.add('G')
    ++size
    await _bytes32Set.add('H')
    ++size
    await _bytes32Set.add('I')
    ++size
    await _bytes32Set.add('J')
    ++size
    assert.equal(await _bytes32Set.contains.call('F'), true)
    assert.equal(await _bytes32Set.contains.call('G'), true)
    assert.equal(await _bytes32Set.contains.call('H'), true)
    assert.equal(await _bytes32Set.contains.call('I'), true)
    assert.equal(await _bytes32Set.contains.call('J'), true)
    await _bytes32Set.remove('J')
    --size
    await _bytes32Set.remove('I')
    --size
    await _bytes32Set.remove('H')
    --size
    assert.equal(await _bytes32Set.contains.call('H'), false)
    assert.equal(await _bytes32Set.contains.call('I'), false)
    assert.equal(await _bytes32Set.contains.call('J'), false)
  })

  it('test get, set', async () => {
    await _bytes32Set.set(0, 'A')
    assert.equal(toAscii((await _bytes32Set.get.call(0))), 'A')
    await _bytes32Set.set(1, 'A')
    assert.equal(toAscii((await _bytes32Set.get.call(1))), 'G')
  })
})
