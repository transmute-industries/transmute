import { getSetupAsync } from '../../__mocks__/setup'
import { Factory } from '../Factory'

import { W3 } from 'soltsice'

/**
 * Factory test
 */
describe('Factory.getReadModel', () => {
  const factoryTypes: any = {
    // UnsafeEventStoreFactory: Factory.Types.UnsafeEventStoreFactory,
    RBACEventStoreFactory: Factory.FactoryTypes.RBACEventStoreFactory
  }

  Object.keys(factoryTypes).map(typeString => {
    it(typeString, async () => {
      let { relic, factoryInstances, accounts, adapter } = await getSetupAsync()
      let rm = await Factory.getReadModel(
        factoryInstances.unsafe,
        adapter,
        factoryReadModelAdapter,
        relic.web3,
        accounts[0]
      )
      let eventStoreContractAddresses = Object.keys(rm.state.model)
      expect(eventStoreContractAddresses.length).toBe(1)
    })
  })
})
