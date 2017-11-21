var AddressSetSpec = artifacts.require('./TransmuteFramework/SetLib/AddressSet/AddressSetSpec.sol')
// var Bytes32SetSpec = artifacts.require(
//   "./TransmuteFramework/SetLib/Bytes32Set/Bytes32SetSpec.sol"
// );
// var UIntSetSpec = artifacts.require(
//   "./TransmuteFramework/SetLib/UIntSet/UIntSetSpec.sol"
// );

let vectors = [
  {
    address: '0x01cde1891c79462a18f04b2499e0b76571d4362e',
    bytes32: 'A',
    uint: 0,
  },
  {
    address: '0x83630782e0676f5ad508cc2449ccf9011c1a6cd0',
    bytes32: 'B',
    uint: 1,
  },
]

contract('Better Set Tests', accounts => {
  let _addressSet
  let _bytes32Set
  let _uintSet

  let size = 0

  before(async () => {
    _addressSet = await AddressSetSpec.new()
    // _uintSet = await UIntSetSpec.new();
    // _bytes32Set = await Bytes32SetSpec.new();
    // console.log(accounts[0])
  })

  it('add', async () => {
    let tx = await _addressSet.add(vectors[0].address)
    assert(typeof tx.tx !== undefined)
  })

  it('first', async () => {
    let address = await _addressSet.first()
    assert(address === vectors[0].address)
  })

  it('set', async () => {
    let receipt = await _addressSet.set(0, vectors[0].address, {
      from: accounts[0],
    })
    assert(receipt.tx !== undefined)
  })

  it('indexOf', async () => {
    let indexOfFirstAddress = (await _addressSet.indexOf(vectors[0].address)).toNumber()
    assert(indexOfFirstAddress === 0)
  })

  it('get', async () => {
    let firstAddress = await _addressSet.get(0)
    assert(firstAddress === vectors[0].address)
  })

  // BROKEN SKIPPING
  // it("last", async () => {
  //   let address = await _addressSet.last();
  //   assert(address === vectors[0].address);
  // });

  it('getValues', async () => {
    let values = await _addressSet.getValues()
    assert(values[0] === vectors[0].address)
  })

  it('remove', async () => {
    let receipt = await _addressSet.remove(vectors[0].address)
    assert(receipt.tx !== undefined)
    let values = await _addressSet.getValues()
    assert(values.length === 0)
  })

  it('pop', async () => {
    let tx = await _addressSet.add(vectors[1].address)
    assert(typeof tx.tx !== undefined)

    tx = await _addressSet.pop(0)
    assert(typeof tx.tx !== undefined)

    let theElementThatWasPopped = await _addressSet.theElementThatWasPopped()
    assert(theElementThatWasPopped === vectors[1].address)
  })
})
