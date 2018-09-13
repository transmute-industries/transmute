/**
 * A module for reading and writing objects to ipfs and ethereum
 * @module src/event-store
 */


const contract = require("truffle-contract");

const pack = require("../../package.json");

const GAS = require("../gas");

/** @class EventStore */
module.exports = class EventStore {
  /**
   * Creates a new EventStore
   * @constructor
   * @memberof EventStore
   * @param {Object} config Config object requiring eventStoreArtifact, web3Config, and ipfsConfig with optional mixpanelConfig
   */
  constructor(config) {
    if (!config) {
      throw new Error("a config of form { web3, abi, adapter } is required.");
    }

    let { web3, abi, adapter } = config;

    if (!web3) {
      throw new Error("a web3 property is required in constructor argument.");
    }

    if (!abi) {
      throw new Error(
        "a truffle-contract abi property is required in constructor argument."
      );
    }

    if (!adapter) {
      throw new Error(
        "an adapter property is required in constructor argument."
      );
    }

    this.version = pack.version;
    this.web3 = web3;
    this.adapter = adapter;

    this.eventStoreArtifact = abi;
    this.eventStoreContract = contract(this.eventStoreArtifact);
    this.eventStoreContract.setProvider(this.web3.currentProvider);
  }

  /**
   * Returns Web3 accounts
   * @function
   * @memberof EventStore
   * @name getWeb3Accounts
   * @returns {Array.<String>} Array of Web3 account addresses
   */
  async getWeb3Accounts() {
    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts((err, accounts) => {
        if (err) {
          reject(err);
        }
        resolve(accounts);
      });
    });
  }

  /**
   * Deploys eventStoreContract if it has not already been deployed
   * @function
   * @memberof EventStore
   * @name init
   */
  async init() {
    if (!this.eventStoreContractInstance) {
      this.eventStoreContractInstance = await this.eventStoreContract.deployed();
    }
  }

  /**
   * Throws error if init() has not been called
   * @function
   * @memberof EventStoreFactory
   * @name requireInstance
   */
  requireInstance() {
    if (!this.eventStoreContractInstance) {
      throw new Error(
        "You must call init() before accessing eventStoreContractInstance."
      );
    }
  }

  /**
   * Creates EventStore instance and assigns it a new EventStoreContract
   * @function
   * @memberof EventStore
   * @name clone
   * @param {String} fromAddress Address used to create new EventStoreContract
   * @returns {Object} EventStore instance
   */
  async clone(fromAddress) {
    const newContract = await this.eventStoreContract.new({
      from: fromAddress,
      gas: GAS.MAX_GAS
    });
    let instance = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this
    );
    instance.eventStoreContractInstance = newContract;
    return instance;
  }

  async getTransactionReceipt(tx) {
    return new Promise((resolve, reject) => {
      this.web3.eth.getTransactionReceipt(tx, function(error, result) {
        if (!error) resolve(result);
        else reject(error);
      });
    });
  }

  /**
   * Writes a key and value to contentID based storage, and writes these values to the eventStoreContractInstance
   * @function
   * @memberof EventStore
   * @name write
   * @param {String} fromAddress Address used to write event to eventStoreContractInstance
   * @param {Object} key Event key
   * @param {Object} value Event value
   * @returns {Object} Event object with original key, value as well as meta from content storage and Ethereum
   */
  async write(fromAddress, key, value) {
    this.requireInstance();

    const { adapter, eventStoreContractInstance } = this;

    const keyContentID = await adapter.writeJson(key);
    const valueContentID = await adapter.writeJson(value);

    const tx = (await eventStoreContractInstance.write(
      keyContentID,
      valueContentID,
      {
        from: fromAddress,
        gas: GAS.EVENT_GAS_COST
      }
    ))["tx"];

    let receipt = await this.getTransactionReceipt(tx);

    return {
      event: {
        sender: fromAddress,
        key,
        value
      },
      meta: {
        tx,
        contentID: {
          key: keyContentID,
          value: valueContentID
        },
        receipt
      }
    };
  }

  /**
   * Reads specified indexed event from eventStoreContractInstance, retrieves its data from content storage, and returns the original key, value, index, and sender
   * @function
   * @memberof EventStore
   * @name read
   * @param {number} index Index of specified event in eventStoreContractInstance
   * @returns {Object} Event object with original key, value, sender, and index
   */
  async read(index) {
    this.requireInstance();
    const { web3, ipfs, eventStoreContractInstance } = this;

    const eventCount = (await this.eventStoreContractInstance.count.call()).toNumber();
    if (eventCount === 0) {
    }

    let values;
    try {
      values = await eventStoreContractInstance.read(index);
    } catch (e) {
      throw new Error("Failed to read values from index.");
    }

    const decoded = [values[0].toNumber(), values[1], values[2], values[3]];

    // TODO: add better handling for cass where the contentID is not resolveable
    return {
      index: decoded[0],
      sender: decoded[1],
      key: await this.adapter.readJson(decoded[2]),
      value: await this.adapter.readJson(decoded[3])
    };
  }

  /**
   * Reads events between specified indices from eventStoreContractInstance
   * @function
   * @memberof EventStore
   * @name read
   * @param {number} startIndex Index of first event for reading
   * @param {number} endIndex Index of last event for reading
   * @returns {Array.<Object>} Array of event objects
   */
  async getSlice(startIndex, endIndex) {
    if (!(endIndex >= startIndex)) {
      throw new Error("startIndex must be less than or equal to endIndex.");
    }
    let index = startIndex;
    let events = [];
    while (index <= endIndex) {
      events.push(await this.read(index));
      index++;
    }
    return events;
  }

  /**
   * Returns health status of adapter and eventStoreContractInstance address
   * @function
   * @memberof EventStore
   * @name healthy
   * @returns {Object} Health status of adapter and eventStoreContractInstance address
   */
  async healthy() {
    this.requireInstance();
    return {
      adapter: !!(await this.adapter.healthy()),
      eventStoreContract: this.eventStoreContractInstance.address
    };
  }

  /**
   * Destroys eventStoreContractInstance
   * @function
   * @memberof EventStore
   * @name destroy
   * @param {String} address Address used to destroy eventStoreContractInstance
   * @returns {Object} Ethereum transaction from EventStore destruction
   */
  destroy(address) {
    return this.eventStoreContractInstance.destroy(address);
  }
};
