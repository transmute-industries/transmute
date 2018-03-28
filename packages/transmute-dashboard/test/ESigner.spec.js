const ESigner = artifacts.require('./ESigner.sol');

contract('ESigner', accounts => {
  it('constructor works', async () => {
    const storage = await ESigner.deployed();
    assert(accounts[0] === (await storage.owner()));
  });

  // it('write - read', async () => {
  //   const storage = await EventStore.deployed();
  //   const tc = new TransmuteEventStore(storage, keenClient);
  //   const rec = await tc.write('a', 'b');
  //   assert(rec.logs[0].event === 'TransmuteEvent');
  //   const triple = await tc.read(0);
  //   assert(triple.length === 3);
  // });

  // it('destroy', async () => {
  //   const storage = await EventStore.deployed();
  //   assert(accounts[0] === (await storage.owner()));
  //   const tc = new TransmuteEventStore(storage);
  //   assert(tc.version === '0.0.1');
  //   assert(tc.storage === storage);
  //   await tc.destroy(accounts[1]);
  // });
});
