const transmuteConfig = require('../../../../../../transmute-config');
const TransmuteIpfsAdatper = require('../index');

describe('TransmuteIpfsAdatper', () => {
  it('healthy', async () => {
    let tia = new TransmuteIpfsAdatper({
      ...transmuteConfig.ipfsConfig
    });
    let health = await tia.healthy();
    // console.log(health);
  });

  it('writeObject', async () => {
    let tia = new TransmuteIpfsAdatper(transmuteConfig.ipfsConfig);
    let dagNode = await tia.writeObject({
      hello: 'world'
    });
    expect(dagNode._json.multihash).toBeDefined();
  });

  it('readObject', async () => {
    let tia = new TransmuteIpfsAdatper(transmuteConfig.ipfsConfig);
    let dagNode = await tia.readObject(
      'QmS8NCThLouhUyomKpWaRoPZtu72qRh1myD3DUBAqz8qrX'
    );
    expect(dagNode).toBeDefined();
  });

});
