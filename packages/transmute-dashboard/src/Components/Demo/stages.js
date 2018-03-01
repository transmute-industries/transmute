import * as T from 'transmute-framework';

import { toast } from 'react-toastify';

import transmute from '../../store/transmute';

import { W3 } from 'soltsice';

const sleep = seconds => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, seconds * 1000);
  });
};

export const startDemo = async props => {
  const { relic, accounts, eventStoreAdapter, readModelAdapter } = window.TT;

  // const factory = await T.Factory.create(relic.web3, accounts[0]);
  // console.log('factory: ', factory.address)
  // const factory = await T.EventStoreFactory.At('0x279c053d364cf033a7d6b026d0abec9041dcc137')
  // const eventStore = await T.Factory.createStore(
  //   factory,
  //   accounts,
  //   relic.web3,
  //   accounts[0]
  // );

  // const eventStore = await T.EventStore.New(W3.TX.txParamsDefaultDeploy(accounts[0]))
  // console.log('eventStore: ', eventStore.address)

  // First, we grab the EventStore Contract:
  const eventStore = await T.EventStore.At(
    '0x057d4e4cb4568426600fea17ec3e51192c487e17'
  );

  const events = [
    {
      type: 'DOCUMENT_CREATED',
      payload: {
        document_name: 'purchase_order_1272',
        multihash: 'QmceFAWK6QbNVLfNZsFmvi7xycFkHMEAeviYuVwT7Q3TLr',
        url:
          'http://ipfs2.transmute.network:8080/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
      },
      meta: {
        adapter: 'I'
      }
    }
  ];

  toast.info('Use MetaMask to Submit the Event.');


  const outputEvents = await T.Store.writeFSAs(
    eventStore,
    eventStoreAdapter,
    relic.web3,
    accounts[0],
    events
  );

  // toast.info('simulating transaction confirmation...');
  // await sleep(1);
  // const outputEvents = [
  //   {
  //     type: 'DOCUMENT_CREATED',
  //     payload: {
  //       document_name: 'purchase_order_1272',
  //       multihash: 'QmceFAWK6QbNVLfNZsFmvi7xycFkHMEAeviYuVwT7Q3TLr',
  //       url:
  //         'http://ipfs2.transmute.network:8080/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
  //     },
  //     meta: {
  //       keyType: 'S',
  //       valueType: 'I',
  //       id: 35,
  //       created: 1519872393,
  //       txOrigin: '0x242c3Cb5d8d9E68a8bBfaC9D6704583f1df80AD6',
  //       msgSender: '0x242c3Cb5d8d9E68a8bBfaC9D6704583f1df80AD6',
  //       isInternal: false,
  //       adapter: 'I',
  //       adapterPayload: {
  //         key: 'multihash',
  //         value: 'QmPrLVCJHkxnDhCNJ5hrQCb2wAQGd9YLtPTfoFwbyQA2dG'
  //       }
  //     }
  //   }
  // ];
  // const outputEvents = await T.Store.readFSAs(
  //   eventStore,
  //   eventStoreAdapter,
  //   relic.web3,
  //   0
  // );
  // console.log(outputEvents);


  console.log(JSON.stringify(outputEvents, null, 2));

  props.actions.onSaveEvents(outputEvents);

  toast.success('Your Event is Stored!');

  const eventStoreReadModel = new T.ReadModel(
    readModelAdapter,
    transmute.eventStoreReducers.documentReducer,
    {
      readModelStoreKey: `EventStore:${eventStore.address}`,
      readModelType: 'EventStore',
      contractAddress: `${eventStore.address}`,
      lastEvent: null,
      model: {}
    }
  );

  console.log(eventStoreReadModel);

  await eventStoreReadModel.sync(eventStore, eventStoreAdapter, relic.web3);

  console.log(eventStoreReadModel.state);

  props.actions.updateEditor(`${props.transmute.editorValue}
// These are the events stored
/*
const events = ${JSON.stringify(outputEvents, null, 2)}
*/

const eventStoreReadModel = new T.ReadModel(
  readModelAdapter,
  transmute.eventStoreReducers.documentReducer,
  {
    readModelStoreKey: 'EventStore:${eventStore.address}',
    readModelType: 'EventStore',
    contractAddress: '${eventStore.address}',
    lastEvent: null,
    model: {}
  }
);
await eventStoreReadModel.sync(eventStore, eventStoreAdapter, relic.web3);

// This model is built automatically from IPFS and Ethereum
/*
const eventStoreReadModelState = ${JSON.stringify(
  eventStoreReadModel.state,
  null,
  2
)}
*/

/*
This concluded the demo.
To learn more, please checkout our blog post.
If you have any feedback, we want it!
Please fill out this survey:

Made with ❤️ in Austin TX

🦄 Transmute 🦄

*/
  `);
};
