/**
 * A module for reading and writing objects to ipfs and ethereum
 * @module src/event-store
 */


const contract = require('truffle-contract');

const pack = require('../../package.json');

const GAS = require('../gas');

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
      throw new Error('a config of form { web3, abi, adapter } is required.');
    }

    const { web3, abi, adapter } = config;

    if (!web3) {
      throw new Error('a web3 property is required in constructor argument.');
    }

    if (!abi) {
      throw new Error(
        'a truffle-contract abi property is required in constructor argument.',
      );
    }

    if (!adapter) {
      throw new Error(
        'an adapter property is required in constructor argument.',
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
        'You must call init() before accessing eventStoreContractInstance.',
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
      gas: GAS.MAX_GAS,
    });
    const instance = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this,
    );
    instance.eventStoreContractInstance = newContract;
    return instance;
  }

  /**
   * Returns transaction receipt
   * @function
   * @memberof EventStore
   * @name getTransactionReceipt
   */
  async getTransactionReceipt(tx) {
    return new Promise((resolve, reject) => {
      this.web3.eth.getTransactionReceipt(tx, (error, result) => {
        if (!error) resolve(result);
        else reject(error);
      });
    });
  }

  /**
   * calls writeContent if called with write(fromAddress, content)
   * calls writeKeyValue if called with write(fromAddress, key, value)
   * @function
   * @memberof EventStore
   * @name write
   */
  async write(fromAddress, ...args) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
    if (args.length === 1) {
      return this.writeContent(fromAddress, args[0]);
    } if (args.length === 2) {
      return this.writeKeyValue(fromAddress, args[0], args[1]);
    }
    throw new Error('Invalid number of parameters for the write function');
  }

  /**
   * Writes an arbitrary JSON object to contentID based storage,
   * and writes the hash to the eventStoreContractInstance
   * @function
   * @memberof EventStore
   * @name writeContent
   * @param {String} fromAddress Address used to write event to eventStoreContractInstance
   * @param {Object} content
   * @returns {Object} Event object with original JSON object
   * as well as meta from content storage and Ethereum
   */
  async writeContent(fromAddress, content) {
    this.requireInstance();

    const { adapter, eventStoreContractInstance } = this;

    const contentHash = await adapter.writeJson(content);

    const tx = (await eventStoreContractInstance.write(
      contentHash,
      {
        from: fromAddress,
        gas: GAS.EVENT_GAS_COST,
      },
    )).tx;

    const receipt = await this.getTransactionReceipt(tx);

    return {
      event: {
        sender: fromAddress,
        content,
      },
      meta: {
        tx,
        contentID: {
          content,
        },
        receipt,
      },
    };
  }

  /**
   * Writes a key and value to contentID based storage,
   * and writes these values to the eventStoreContractInstance
   * @function
   * @memberof EventStore
   * @name writeKeyValue
   * @param {String} fromAddress Address used to write event to eventStoreContractInstance
   * @param {Object} key Event key
   * @param {Object} value Event value
   * @returns {Object} Event object with original key, value
   * as well as meta from content storage and Ethereum
   */
  async writeKeyValue(fromAddress, key, value) {
    const content = {
      key,
      value,
    };
    return this.writeContent(fromAddress, content);
  }

  /**
   * Reads specified indexed event from the event log of eventStoreContractInstance
   * @function
   * @memberof EventStore
   * @name readTransmuteEvent
   * @returns {Object} Event object
   */
  readTransmuteEvent(contractInstance, eventIndex) {
    // The contract JS Api (see links belows) only offers callbacks.
    // Here we Promisify the callback so that we can `await` it in `read()`
    return new Promise((resolve, reject) => {
      // Reference: github.com/ethereum/wiki/wiki/JavaScript-API#contract-events
      // Possible alternative: github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter
      const eventSubscription = contractInstance.contract.TransmuteEvent({
        filter: {
          index: eventIndex,
        },
        // TODO: Optimize by scanning fromBlock of contract creation
        fromBlock: 0,
      });
      eventSubscription.get((error, logs) => {
        if (error) {
          reject(error);
        } else {
          resolve(logs);
        }
      });
    });
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

    let events;
    try {
      events = await this.readTransmuteEvent(eventStoreContractInstance, index);
    } catch (e) {
      throw new Error('Could not read from Ethereum event log');
    }

    if (events.length === 0) {
      throw new Error('No event exists for that index');
    }

    const values = events[0].args;
    try {
      const content = await this.adapter.readJson(values.contentHash);
      return {
        index: values.index.toNumber(),
        sender: values.sender,
        content,
      };
    } catch (e) {
      throw new Error('Couldn\'t resolve contentHash');
    }
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
      throw new Error('startIndex must be less than or equal to endIndex.');
    }
    let index = startIndex;
    const events = [];
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
      eventStoreContract: this.eventStoreContractInstance.address,
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
