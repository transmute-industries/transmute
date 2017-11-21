var AddressSetSpec = artifacts.require('./TransmuteFramework/SetLib/AddressSet/AddressSetSpec.sol')
var Bytes32SetSpec = artifacts.require('./TransmuteFramework/SetLib/Bytes32Set/Bytes32SetSpec.sol')
var UIntSetSpec = artifacts.require('./TransmuteFramework/SetLib/UIntSet/UIntSetSpec.sol')

let vectors = [
  {
    address: '0x01cde1891c79462a18f04b2499e0b76571d4362e',
    bytes32: 'A',
    uint: 0,
  },
]

contract('Better Set Tests', function(accounts) {
  let _addressSet
  let _bytes32Set
  let _uintSet

  let size = 0

  before(async function() {
    _addressSet = await AddressSetSpec.new()
    _uintSet = await UIntSetSpec.new()
    _bytes32Set = await Bytes32SetSpec.new()

    console.log(accounts[0])
  })

  let addElement = async value => {
    let tx = await _addressSet.add(value)
    assert(typeof tx.tx !== undefined)
  }

  it('add', async () => {
    await addElement(accounts[0])
  })
})
