import { getDefaultWeb3 } from './getWeb3'
import { Relic } from '../transmute-framework'

export const getDefaultRelic = () => {
  const { web3 } = getDefaultWeb3()
  const relic = new Relic(web3)
  return relic
}
