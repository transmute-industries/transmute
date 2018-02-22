import * as T from 'transmute-framework';
import { W3 } from 'soltsice';


export const createFactory = async () => {
  const { relic, eventStoreAdapter, readModelAdapter } = window.TT;
  const accounts = await relic.getAccounts();
  console.log(W3.TC);

  console.log(accounts);

  const instance = await T.EventStoreFactory.New(
    { from: accounts[0] },
    {
      _multisig: accounts[0]
    }
  );

  console.log(instance);

  // console.log(await T.EventStoreFactory.New())

  // let data = await T.EventStoreFactory.New( {}, relic.web3)

  // console.log(data)

  // let factory = await T.Factory.create(relic.web3, accounts[0]);

  // console.log('creating...', factory);
};
