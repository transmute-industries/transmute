const EventStore = artifacts.require('./EventStore.sol');

contract('EventStore', (accounts) => {
  let es;

  before(async () => {
    es = await EventStore.deployed();
  });

  describe('write', () => {
    let receipt;
    const contentHash = '0x3fd54831f488a22b28398de0c567a3b064b937f54f81739ae9bd545967f3abab';

    before(async () => {
      receipt = await es.write(contentHash, { from: accounts[1] });
    });

    it('should emit a TransmuteEvent event', async () => {
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, 'TransmuteEvent');
    });

    it('should write the correct information to the event log', async () => {
      const info = receipt.logs[0].args;
      assert.ok(info);
      assert.equal(info.index, 0);
      assert.equal(info.sender, accounts[1]);
      assert.equal(info.contentHash, contentHash);
    });

    it('should increment the count variable', async () => {
      const count = await es.count.call();
      assert.equal(count, 1);
    });
  });
});
