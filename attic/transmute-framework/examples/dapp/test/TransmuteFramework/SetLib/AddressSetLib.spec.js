var Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
var AddressSetSpec = artifacts.require('./TransmuteFramework/SetLib/AddressSet/AddressSetSpec.sol')

contract('addressSet', function(accounts) {

  let _addressSet;
  let size = 0

  before(async function() {
    _addressSet = await AddressSetSpec.new();
  });

  it('test add, last', async () => {
    await _addressSet.add(accounts[0])
    ++size
    assert.equal(await _addressSet.last.call(), accounts[0])
    await _addressSet.add(accounts[1])
    ++size
    assert.equal(await _addressSet.last.call(), accounts[1])
    await _addressSet.add(accounts[2])
    ++size
    assert.equal(await _addressSet.last.call(), accounts[2])
    await _addressSet.add(accounts[3])
    ++size
    assert.equal(await _addressSet.last.call(), accounts[3])
    await _addressSet.add(accounts[4])
    ++size
    assert.equal(await _addressSet.last.call(), accounts[4])
  })

  it('test indexOf', async () => {
    assert.equal(await _addressSet.indexOf.call(accounts[0]), 0)
    assert.equal(await _addressSet.indexOf.call(accounts[1]), 1)
    assert.equal(await _addressSet.indexOf.call(accounts[2]), 2)
    assert.equal(await _addressSet.indexOf.call(accounts[3]), 3)
    assert.equal(await _addressSet.indexOf.call(accounts[4]), 4)
  })

  it('test remove, first', async () => {
    assert.equal(await _addressSet.first.call(), accounts[0])
    await _addressSet.remove(accounts[0])
    --size
    assert.equal(await _addressSet.size.call(), size)
    assert.equal(await _addressSet.first.call(), accounts[4])
    await _addressSet.remove(accounts[4])
    --size
    assert.equal(await _addressSet.size.call(), size)
    assert.equal(await _addressSet.first.call(), accounts[3])
    await _addressSet.remove(accounts[3])
    --size
    assert.equal(await _addressSet.size.call(), size)
    assert.equal(await _addressSet.first.call(), accounts[2])
    await _addressSet.remove(accounts[2])
    --size
    assert.equal(await _addressSet.size.call(), size)
    assert.equal(await _addressSet.first.call(), accounts[1])
    await _addressSet.remove(accounts[1])
    --size
    assert.equal(await _addressSet.size.call(), size)
  })

  it('test add, remove, contains', async () => {
    await _addressSet.add(accounts[5])
    ++size
    await _addressSet.add(accounts[6])
    ++size
    await _addressSet.add(accounts[7])
    ++size
    await _addressSet.add(accounts[8])
    ++size
    await _addressSet.add(accounts[9])
    ++size
    assert.equal(await _addressSet.contains.call(accounts[5]), true)
    assert.equal(await _addressSet.contains.call(accounts[6]), true)
    assert.equal(await _addressSet.contains.call(accounts[7]), true)
    assert.equal(await _addressSet.contains.call(accounts[8]), true)
    assert.equal(await _addressSet.contains.call(accounts[9]), true)
    await _addressSet.remove(accounts[9])
    --size
    await _addressSet.remove(accounts[8])
    --size
    await _addressSet.remove(accounts[7])
    --size
    assert.equal(await _addressSet.contains.call(accounts[7]), false)
    assert.equal(await _addressSet.contains.call(accounts[8]), false)
    assert.equal(await _addressSet.contains.call(accounts[9]), false)
  })

  it('test get, set', async () => {
    await _addressSet.set(0, accounts[0])
    assert.equal(await _addressSet.get.call(0), accounts[0])
    await _addressSet.set(1, accounts[0])
    assert.equal(await _addressSet.get.call(1), accounts[6])
  })
});
