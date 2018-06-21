# Transmute Framework

- [Docs](https://docs.transmute.industries/transmute-framework/0.2.2/)

The transmute framework converts javascript objects to ipfs hashes, and stores them on ethereum smart contracts.

It is meant to be a building block for decentralized applications that are built on immutable event logs.

It also supports some Redux like functionality which makes building models from event streams easy. These models can then be saved to document databases for querying and indexing.

The environment used by the framework can easily be configured in `./src/transmute-config/env.json`.

#### Getting Started With Ganache

If you want to use the framework with ganache and a local ipfs node, you can do so by using the `localhost` env.

First, make sure to install and start ipfs and ganache in the default manner:

```
ipfs daemon
ganache-cli
```

Next, use `TRANSMUTE_ENV` to test the framework with this local environment.

```
npm i
TRANSMUTE_ENV='localhost' npm run truffle:test
TRANSMUTE_ENV='localhost' npm run truffle:migrate
TRANSMUTE_ENV='localhost' npm run test
```

#### Getting Started With Minikube

If you are using the minikube environment, you will need to ensure that the framework is configured to connect to the correct ipfs and ethereum rpc interface.


Follow the instructions in the root level [readme](https://github.com/transmute-industries/transmute/blob/master/README.md).

```

export KONG_ADMIN_URL=$(minikube service gateway-kong-admin --url | sed 's,http://,https://,g')
export KONG_PROXY_URL=$(minikube service gateway-kong-proxy --url | sed 's,http://,https://,g')

echo $KONG_PROXY_URL

curl -k -X GET \
  --url $KONG_ADMIN_URL/apis \
  | jq -r '.'
```

You can configure your `/etc/hosts` like so:

```
192.168.99.100  transmute.minikube
192.168.99.100  ipfs.transmute.minikube
192.168.99.100  ganache.transmute.minikube
```

With the `/scripts/configure-hosts.sh` from the root of the repo.

Update minikube in `./src/transmute-config/env.json`. 

The kong proxy port is likly the only thing that will change when using minikube locally.

```
npm i
npm run truffle:test
npm run truffle:migrate
npm run test
```

#### Usage

The examples below are pulled from the `__tests__` directories, that are run by travis ci.

The `EventStoreFactory` contract can be used to create `EventStore` contracts.

```
const eventStoreFactoryArtifact = require('../../../build/contracts/EventStoreFactory.json');
const transmuteConfig = {
  "mixpanelConfig": {
    ...
  },
  "ipfsConfig": {
    "host": "ipfs.transmute.minikube",
    "port": 32443,
    "protocol": "https"
  },
  "web3Config": {
    "providerUrl": "https://ganache.transmute.minikube:32443"
  }
}
eventStoreFactory = new EventStoreFactory({
  eventStoreFactoryArtifact,
  ...transmuteConfig
});

await eventStoreFactory.init();
let result = await eventStoreFactory.createEventStore(
  accounts[0]
);
```

Saving key-value pairs to an `EventStore` contract can be done like so:

```
const EventStore = require('../index.js');
const transmuteConfig = require('../../transmute-config');
const eventStoreArtifact = require('../../../build/contracts/EventStore.json');

const eventStore = new EventStore({
  eventStoreArtifact,
  ...transmuteConfig
});

await eventStore.init();

const event = {
  key: {
    type: 'ACCOUNT_CREATED',
    value: '0x123'
  },
  value: {
    name: 'alice'
  }
}

let result = await eventStore.write(
  accounts[0],
  event.key,
  event.value
);

```

Events can be retrieved using:

```
let events = await eventStore.getSlice(0, 2);
```

##### Encryption should be used before saving sensitive information to Ethereum and IPFS!

Stream models can be built from the events like so:

```
const filter = event => {
  return true;
};
const reducer = (state, event) => {
  let eventHash = eventStore.web3.sha3(JSON.stringify(event));
  const eventHashes = new Set(state.eventHashes || []);
  eventHashes.add(eventHash);
  return {
    ...state,
    eventHashes: Array.from(eventHashes)
  };
};
const streamModel = new StreamModel(eventStore, filter, reducer);
await eventStore.write(
  accounts[0],
  someNewEvent.key,
  someNewEvent.value
);
await streamModel.sync();
```

Stream models filter events, and then use a reducer function to build up state, just like Redux!

See `./src/__tests__` for more example usage.

