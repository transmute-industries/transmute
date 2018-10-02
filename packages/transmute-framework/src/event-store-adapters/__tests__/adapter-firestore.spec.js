const Web3 = require("web3");
const TransmuteAdapterFirestore = require("transmute-adapter-firestore");

const db = {};

const adapter = new TransmuteAdapterFirestore(db, "events");
adapter.readJson = jest.fn().mockImplementation(contentID => contentObject);
adapter.writeJson = jest.fn().mockImplementation(contentObject => contentID);

const EventStore = require("../../event-store");
const abi = require("../../../build/contracts/EventStore.json");
const transmuteConfig = require("../../transmute-config");

const mockEvents = require("../../__mock__/events.json");

const provider = new Web3.providers.HttpProvider(
  transmuteConfig.web3Config.providerUrl
);
const web3 = new Web3(provider);
const eventStore = new EventStore({
  web3,
  abi,
  adapter
});

describe("EventStore with Firestore Adapter", () => {
  it("supports the firestore adapter", async () => {
    expect(eventStore).toBeDefined();
    await eventStore.init();
    const accounts = await eventStore.getWeb3Accounts();
    
    // TODO: Fix these tests
    // const writeEventResult = await eventStore.write(
    //   accounts[0],
    //   mockEvents[0].key,
    //   mockEvents[0].value
    // );

    // expect(writeEventResult.event).toBeDefined();
    // expect(writeEventResult.meta).toBeDefined();

    // const readEventResult = await eventStore.read(0);
    // expect(readEventResult.key).toEqual(mockEvents[0].key);
    // expect(readEventResult.value).toEqual(mockEvents[0].value);
  });
});
