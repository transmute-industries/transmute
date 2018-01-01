var AddressSetSpec = artifacts.require('./TransmuteFramework/SetLib/AddressSet/AddressSetSpec.sol')
var Bytes32SetSpec = artifacts.require('./TransmuteFramework/SetLib/Bytes32Set/Bytes32SetSpec.sol')
var UIntSetSpec = artifacts.require('./TransmuteFramework/SetLib/UIntSet/UIntSetSpec.sol')

let vectors = [
  {
    address: '0x01cde1891c79462a18f04b2499e0b76571d4362e',
    bytes32: '0x4100000000000000000000000000000000000000000000000000000000000000',
    uint: 0,
  },
  {
    address: '0x83630782e0676f5ad508cc2449ccf9011c1a6cd0',
    bytes32: '0x4200000000000000000000000000000000000000000000000000000000000000',
    uint: 1,
  },
]

const cleanData = (type, data) => {
  switch (type) {
    case 'address':
      return data
    case 'uint':
      return data.toNumber()
    case 'bytes32':
      return data
  }
}

contract('SetLibs', accounts => {
  const _types = ['address', 'bytes32', 'uint']
  let _addressSet
  let _bytes32Set
  let _uintSet
  let _sets
  let set

  before(async () => {
    _addressSet = await AddressSetSpec.new()
    _uintSet = await UIntSetSpec.new()
    _bytes32Set = await Bytes32SetSpec.new()
    _sets = {
      address: _addressSet,
      bytes32: _bytes32Set,
      uint: _uintSet,
    }
  })

  _types.forEach(type => {
    describe(type, async () => {
      before(async () => {
        set = _sets[type]
      })

      it('add ', async () => {
        let element = vectors[0][type]
        let receipt = await set.add(element)
        assert(typeof receipt.tx !== undefined)
      })
      it('first', async () => {
        let el = await set.first()
        assert(cleanData(type, el) === vectors[0][type])
      })

      it('set', async () => {
        let receipt = await set.set(0, vectors[0][type], {
          from: accounts[0],
        })
        assert(receipt.tx !== undefined)
      })

      it('indexOf', async () => {
        let data = await set.indexOf(vectors[0][type])
        assert(cleanData('uint', data) === 0)
      })

      it('get', async () => {
        let data = await set.get(0)
        assert(cleanData(type, data) === vectors[0][type])
      })

      it('last', async () => {
        let data = await set.last()
        assert(cleanData(type, data) === vectors[0][type])
      })

      it('getValues', async () => {
        let values = await set.getValues()
        assert(cleanData(type, values[0]) === vectors[0][type])
      })

      it('remove', async () => {
        let receipt = await set.remove(vectors[0][type])
        assert(receipt.tx !== undefined)
        let values = await set.getValues()
        assert(values.length === 0)
      })

      it('pop', async () => {
        let tx = await set.add(vectors[1][type])
        assert(typeof tx.tx !== undefined)

        tx = await set.pop(0)
        assert(typeof tx.tx !== undefined)

        let lastPop = await set.lastPop()
        assert(cleanData(type, lastPop) === vectors[1][type])
      })

      it('contains', async () => {
        let tx = await set.add(vectors[1][type])
        assert(typeof tx.tx !== undefined)

        let doesSetContain1 = await set.contains(vectors[1][type])
        assert(doesSetContain1)
      })

      it('size', async () => {
        let size = (await set.size()).toNumber()
        assert(size === 1)
      })
    })
  })
})
