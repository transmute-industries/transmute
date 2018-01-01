const TransmuteFramework = require("transmute-framework").default;

const SECRET = "the cake is a lie";
const URL = "https://example.com";

const { getHmac } = require("./common");

const contractArtifacts = {
  esa: require("../build/contracts/ArtifactDeployer"),
  esfa: require("../build/contracts/ArtifactDeployerFactory")
};

const T = TransmuteFramework.init(
  Object.assign(
    {
      providerUrl: "http://localhost:8545",
      ipfsConfig: {
        host: "localhost",
        port: "5001",
        options: {
          protocol: "http"
        }
      },
      TRANSMUTE_API_ROOT: "http://localhost:3001"
    },
    contractArtifacts
  )
);

let eventstore;

const getNewEventStoreAddress = async () => {
  let accounts = await T.getAccounts();
  let factory = await T.EventStoreFactoryContract.deployed();
  let { events, tx } = await T.Factory.createEventStore(factory, accounts[0]);
  return events[0].payload.address;
};

// return getNewEventStoreAddress()

const writeRequest = async () => {
  let accounts = await T.getAccounts();
  let data = await T.EventStore.writeFSA(eventstore, accounts[0], {
    type: "REQUEST",
    payload: {
      url: "https://example.com"
    }
  });
  console.log(data);
};

const readRequest = async () => {
  let accounts = await T.getAccounts();
  let lastEvent =
    (await eventstore.eventCount.call({
      from: accounts[0]
    })).toNumber() - 1;
  let retrievedEvent = await T.EventStore.readFSA(
    eventstore,
    accounts[0],
    lastEvent
  );
  return retrievedEvent;
};

const writeResponse = async requestEvent => {
  let accounts = await T.getAccounts();
  let hash = await getHmac(requestEvent.payload.url, SECRET);
  console.log("mac: ", hash);
  let data = await T.EventStore.writeFSA(eventstore, accounts[0], {
    type: "RESPONSE",
    payload: {
      hmac: "0x" + hash
    }
  });
  console.log(data);
};

const test = async () => {
  let eventStoreAddress = await getNewEventStoreAddress();
  eventstore = await T.EventStoreContract.at(eventStoreAddress);
  await writeRequest();
  let requestEvent = await readRequest();
  await writeResponse(requestEvent);
};

test();
