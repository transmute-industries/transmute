const ipfsAPI = require('ipfs-api')
const ipld = require('ipld-dag-cbor')
const jiff = require('jiff')

import { TransmuteIpfs } from './TransmuteIpfs'

import * as _ from 'lodash'

let e0 = require('./mock/events/0.json')
let e1 = require('./mock/events/1.json')
let e2 = require('./mock/events/2.json')

// THIS TEST NEEDS TO BE SPLIT UP !!! FFFS

describe('TransmuteIpfs', () => {
  describe('init()', () => {
    it('should use local ipfs by default', () => {
      TransmuteIpfs.init()
      expect(TransmuteIpfs.config.host).toBe('localhost')
    })
    it('should support infura via config', () => {
      TransmuteIpfs.init({
        host: 'ipfs.infura.io',
        port: '5001',
        options: {
          protocol: 'https',
        },
      })

      expect(TransmuteIpfs.config.host).toBe('ipfs.infura.io')
    })
  })
  describe('addFromFs(folderPath, options)', () => {
    beforeAll(() => {
      TransmuteIpfs.init()
    })
    it('should add folder to ipfs and return the result', () => {
      return TransmuteIpfs.addFromFs('./src/TransmuteIpfs/mock/demo').then(res => {
        expect(res[0].path).toBe('demo/config.json')
        expect(res[1].path).toBe('demo')
      })
    })

    it('should throw an error when add folder to ipfs fails', async () => {
      try {
        let res = await TransmuteIpfs.addFromFs('./src/TransmuteIpfs/mock/demo2')
      } catch (e) {
        expect(e.code).toBe('ENOENT')
      }
    })
  })
  describe('addFromURL(url)', () => {
    beforeAll(() => {
      TransmuteIpfs.init()
    })
    it('should add folder to ipfs and return the result', async () => {
      const res = await TransmuteIpfs.addFromURL(
        'https://vignette3.wikia.nocookie.net/nyancat/images/7/7c/Nyan_gary.gif'
      )
      expect(res[0].path).toBe('QmSAKHa2JdKrhmBKrqWrBAtS7ACwofiRAEWzYNbXdssBEe')
      expect(res[0].hash).toBe('QmSAKHa2JdKrhmBKrqWrBAtS7ACwofiRAEWzYNbXdssBEe')
    })

    it('should throw an error when add folder to ipfs fails', async () => {
      try {
        const res = await TransmuteIpfs.addFromURL(
          'https://vignette3.wikia.nocookie.net/nyancat/images/7/7c/Nyan_gary22.gif'
        )
      } catch (e) {
        expect(e.message).toBe('Failed to download with 404')
      }
    })
  })
  describe('writeObject(obj)', () => {
    beforeAll(() => {
      TransmuteIpfs.init()
    })
    it('should add json object to ipfs and return the path', async () => {
      let obj = { cool: 'story...bro' }
      const path = await TransmuteIpfs.writeObject(obj)
      expect(path).toBe('Qmc1JeeB3FheBYaMRFcwT6v5pwmhxeh7pGmVNuQPekA7m9')
    })
  })
  describe('readObject(path)', () => {
    beforeAll(() => {
      TransmuteIpfs.init()
    })
    it('should add json object to ipfs and return the path', async () => {
      let obj: any = await TransmuteIpfs.readObject('Qmc1JeeB3FheBYaMRFcwT6v5pwmhxeh7pGmVNuQPekA7m9')
      expect(obj.cool).toBe('story...bro')
    })
  })

  describe('statesToPatches(states)', () => {
    beforeAll(() => {
      TransmuteIpfs.init()
    })
    it('should convert an array of states to an array of patches from state 0 to state n', async () => {
      let articleStates = [e0, e1, e2]
      let patches = await TransmuteIpfs.statesToPatches(articleStates)
      // console.log(patches)
      expect(patches[0][0].op).toBe('add')
    })
  })

  describe('patchesToHashes(patches)', () => {
    beforeAll(() => {
      TransmuteIpfs.init()
    })
    it('should save patchObjects as CBOR encoded Buffers on IPFS and return as hashes', async () => {
      let articleStates = [e0, e1, e2]
      let patches = await TransmuteIpfs.statesToPatches(articleStates)
      let hashes = await TransmuteIpfs.patchesToHashes(patches)
      // console.log(hashes)
    })
  })

  describe('hashesToPatches(hashes)', () => {
    beforeAll(() => {
      TransmuteIpfs.init()
    })
    it('should rehydrate CBOR encoded Buffers from IPFS hashes as patch objects', async () => {
      let articleStates = [e0, e1, e2]
      let patches = await TransmuteIpfs.statesToPatches(articleStates)
      let hashes = await TransmuteIpfs.patchesToHashes(patches)
      let reconstructedPatches = await TransmuteIpfs.hashesToPatches(hashes)
      // console.log(reconstructedPatches)
      expect(reconstructedPatches[0][0].op).toBe('add')
    })
  })

  describe('applyIPLDHashes(hashes)', () => {
    beforeAll(() => {
      TransmuteIpfs.init()
    })
    it('should rehydrate CBOR encoded Buffers from IPFS hashes as patch objects', async () => {
      let articleStates = [e0, e1, e2]
      let patches = await TransmuteIpfs.statesToPatches(articleStates)
      let hashes = await TransmuteIpfs.patchesToHashes(patches)
      let patched = await TransmuteIpfs.applyIPLDHashes(e0, hashes)
      // console.log(patched)
      expect(patched.blocks[1].text).toBe('Welcome to IPFS and Ethereum')
    })
  })

  describe('Sanity', () => {
    beforeAll(() => {
      TransmuteIpfs.init()
    })
    it('jiff patching works as expected', () => {
      let start = {
        a: [0, 1],
        b: {
          cool: 'story',
        },
      }
      let end = {
        a: [3],
        b: {
          dead: 'pool',
        },
      }
      let patch = jiff.diff(start, end)
      let patched = TransmuteIpfs.applyPatches(start, [patch])
      // console.log(patched)
      expect(_.isEqual(patched, end)).toBe(true)
    })

    it('jiff patching works as expected', done => {
      let start = {
        a: [0, 1],
        b: {
          cool: 'story',
        },
      }
      let end = {
        a: [3],
        b: {
          dead: 'pool',
        },
      }
      let patch = jiff.diff(start, end)
      let patched = jiff.patch(patch, start)
      expect(_.isEqual(patched, end)).toBe(true)
      done()
    })
    it('IPLD + IPFS raw checks', done => {
      let rawJsonObject = {
        hello: 'world',
        probablyError: undefined,
      }
      let test = async () => {
        let buffer = await new Promise((resolve, reject) => {
          ipld.util.serialize(rawJsonObject, (err, serialized) => {
            if (err) {
              reject(err)
            }
            resolve(serialized)
          })
        })

        let data = await TransmuteIpfs.ipfs.add(buffer)
        let { hash } = data[0]
        TransmuteIpfs.ipfs.cat(hash, function(err, stream) {
          if (err) {
            throw err
          }
          let res = new Buffer('')
          stream.on('data', function(chunk) {
            res = Buffer.concat([res, chunk])
          })
          stream.on('error', function(err) {
            if (err) {
              throw err
            }
            // console.error('Oh nooo', err)
          })
          stream.on('end', async () => {
            let unm: any = await new Promise((resolve, reject) => {
              ipld.util.deserialize(res, (err, data) => {
                if (err) {
                  reject(err)
                }
                resolve(data)
              })
            })
            expect(unm.probablyError).toBe(undefined)
            done()
          })
        })
      }
      test()
    })
  })
})
