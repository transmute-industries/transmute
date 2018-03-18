let ipfsAdapter = require('transmute-adapter-ipfs')

let ipfs = ipfsAdapter.getStorage({
  host: 'ipfs.transmute.minikube',
  port: 32443,
  protocol: 'https'
})

describe('ipfs tests', () => {
  it('vanilla ipfs provider', async () => {
    let data = await ipfsAdapter.setItem(ipfs, {
      yolo: 1
    })
    expect(data).toBeDefined()
  })
})
