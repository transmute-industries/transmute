const transmuteConfig = require('../../../../../../transmute-config');
const TransmuteIpfsAdatper = require('../index');

describe('TransmuteIpfsAdatper', () => {
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

  it('headers', async () => {
    let tia = new TransmuteIpfsAdatper({
      ...transmuteConfig.ipfsConfig,
      headers: {
        // authorization: 'Bearer XYZ',
        // host: 'ipfs.transmute.minikube'
      }
    });
    let health = await tia.healthy();
  });
});
