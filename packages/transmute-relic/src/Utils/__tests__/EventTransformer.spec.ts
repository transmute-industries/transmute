import BigNumber from 'bignumber.js'
import * as EventTransformer from '../EventTransformer'

/**
 * EventTransformer tests
 */
describe('arrayToFSA', () => {
  it('can convert values array to fsa', async () => {
    let values = [
      new BigNumber(2),
      '0x32623b5a8f898847180ad2017267a29224ed5d96',
      '0x32623b5a8f898847180ad2017267a29224ed5d96',
      new BigNumber(3),
      '0x7465737400000000000000000000000000000000000000000000000000000000',
      '0x53',
      '0x53',
      '0x6b65790000000000000000000000000000000000000000000000000000000000',
      '0x76616c7565000000000000000000000000000000000000000000000000000000'
    ]
    let fsa = EventTransformer.arrayToFSA(values)
    expect(fsa.meta.id).toBe(2)
  })
})
