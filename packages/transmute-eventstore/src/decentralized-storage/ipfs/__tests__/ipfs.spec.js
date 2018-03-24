const { env } = require('../../../../../../transmute-config');

const TransmuteIpfsAdatper = require('../index');

const TRANSMUTE_ENV = process.env.TRANSMUTE_ENV;

describe('TransmuteIpfsAdatper', () => {
  it('writeObject', async () => {
    let tia = new TransmuteIpfsAdatper(env[TRANSMUTE_ENV].ipfs);
    let dagNode = await tia.writeObject({
      hello: 'world'
    });
    expect(dagNode._json.multihash).toBeDefined();
  });

  it('readObject', async () => {
    let tia = new TransmuteIpfsAdatper(env[TRANSMUTE_ENV].ipfs);
    let dagNode = await tia.readObject(
      'QmS8NCThLouhUyomKpWaRoPZtu72qRh1myD3DUBAqz8qrX'
    );
    expect(dagNode).toBeDefined();
  });

  it('headers', async () => {
    let tia = new TransmuteIpfsAdatper({
      ...env[TRANSMUTE_ENV].ipfs,
      headers: {
        // authorization: 'Bearer XYZ',
        // host: 'ipfs.transmute.minikube'
      }
    });
    let health = await tia.healthy();
  });
});
