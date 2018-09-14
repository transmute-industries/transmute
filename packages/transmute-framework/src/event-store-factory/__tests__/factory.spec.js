const EventStoreFactory = require("../index.js");

const transmuteConfig = require("../../transmute-config");
const abi = require("../../../build/contracts/EventStoreFactory.json");

const Web3 = require("web3");


const provider = new Web3.providers.HttpProvider(
  transmuteConfig.web3Config.providerUrl
);

const web3 = new Web3(provider);

describe("transmute-framework-factory", () => {
  let accounts;
  let eventStoreFactory;

  beforeAll(async () => {
    eventStoreFactory = new EventStoreFactory({
      web3,
      abi
    });
    accounts = await eventStoreFactory.getWeb3Accounts();

    try {
      return await eventStoreFactory.getEventStores();
    } catch (err) {
      expect(err.name).toEqual("Error");
    }

    await eventStoreFactory.init();
  });

  // new event store factory per test
  beforeEach(async () => {
    eventStoreFactory = await eventStoreFactory.clone(accounts[0]);
  });

  describe("createEventStore", () => {
    it("can create an EventStore", async () => {
      let initialEventStores = await eventStoreFactory.getEventStores();
      let result = await eventStoreFactory.createEventStore(accounts[0]);
      let eventStores = await eventStoreFactory.getEventStores();
      expect(eventStores.length - initialEventStores.length).toBe(1);
    });
  });

  describe("destroy", () => {
    it("can destroy an EventStoreFactory", async () => {
      await eventStoreFactory.destroy(accounts[0], accounts[0]);
      try {
        return await eventStoreFactory.getEventStores();
      } catch (err) {
        expect(err.name).toEqual("Error");
      }
    });
  });
});
