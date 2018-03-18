let ipfsAdapter = require('transmute-adapter-ipfs')

let transmuteConfig = require('../transmute-config.json')
let ipfs = ipfsAdapter.getStorage(transmuteConfig.minikube.ipfs.config)

describe('ipfs tests', () => {
  it('vanilla ipfs provider', async () => {
    let data = await ipfsAdapter.setItem(ipfs, {
      yolo: 1
    })
    expect(data).toBeDefined()
  })
})
