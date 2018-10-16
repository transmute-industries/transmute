const EventStore = artifacts.require('./EventStore.sol');

contract('EventStore', accounts => {
  let es;

  before(async () => {
    es = await EventStore.deployed();
  });

  describe('write', () => {
    let receipt;
    const key1 = '0x3fd54831f488a22b28398de0c567a3b064b937f54f81739ae9bd545967f3abab';
    const value1 = '0x2a1acd26847576a128e3dba3aa984feafffdf81f7c7b23bdf51e7bec1c15944c';

    before(async () => {
      receipt = await es.write(key1, value1, {from: accounts[1]});
    });

    it('should emit a TransmuteEvent event', async () => {
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'TransmuteEvent')
    });

    it('should write the correct information to the event log', async () => {
      const info = receipt.logs[0].args;
      assert.ok(info);
      assert.equal(info.index, 0);
      assert.equal(info.sender, accounts[1]);
      assert.equal(info.key, key1);
      assert.equal(info.value, value1);
    });

    it('should increment the count variable', async () => {
      const count = await es.count.call();
      assert.equal(count, 1);
    });
  });
});
