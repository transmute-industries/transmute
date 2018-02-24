import * as T from 'transmute-framework';
import { W3 } from 'soltsice';

export const createFactory = async () => {
  const { relic, eventStoreAdapter, readModelAdapter } = window.TT;
  const accounts = await relic.getAccounts();
  const factory = await T.Factory.create(relic.web3, accounts[0]);
  return factory;
};

export const getFactoryReadModel = async factory => {
  // const { relic, eventStoreAdapter, readModelAdapter } = window.TT;
  // const accounts = await relic.getAccounts();

  // console.log('readmodel...', factory)
  // let readModel = await T.Factory.getReadModel(
  //   factory,
  //   eventStoreAdapter,
  //   readModelAdapter,
  //   relic.web3,
  //   accounts[0]
  // );
  // console.log('readmodel...', readModel)
  // return readModel.sync(factory, eventStoreAdapter, relic.web3)
};
