import * as tools from './_tools';

describe('root', () => {
  const ipfsIp = tools.getIpfsInternalClusterIp();
  const kongAPI = tools.getKongApiEndpoint();
  const kongProxy = tools.getKongProxyEndpoint();

  beforeAll(() => {
    tools.deleteIpfsFromKong(kongAPI);
    const response = tools.addIpfsGatewayToKong(kongAPI, ipfsIp);
    console.log(JSON.stringify(response, null, 2));
    console.log('created example api.');
  });

  it('can get ipfs readme from kong', () => {
    const readme = tools.getIpfsReadmeFromKong(kongProxy);
    console.log(readme);
  });

  afterAll(() => {
    const response = tools.deleteIpfsFromKong(kongAPI);
    console.log('deleted example api.');
  });
});
