/**
 * A module for reading and writing objects to ipfs and ethereum
 * @module src/event-store
 */

const contract = require('truffle-contract');
const pack = require('../../package.json');

/** @class EventStore */
module.exports = class EventStore {
  /**
   * Creates a new EventStore
   * @constructor
   * @memberof EventStore
   * @param {Object} config Config object requiring eventStoreArtifact,
   * web3Config, and ipfsConfig with optional mixpanelConfig
   */
  constructor(config) {
    if (!config) {
      throw new Error('a config of form { web3, abi, adapter } is required.');
    }

    const {
      web3, abi, adapter,
    } = config;
    if (!web3) {
      throw new Error('a web3 property is required in constructor argument.');
    }
    if (!abi) {
      throw new Error('an abi property is required in constructor argument.');
    }
    if (!adapter) {
      throw new Error('an adapter property is required in constructor argument.');
    }

    this.version = pack.version;
    this.web3 = web3;
    this.adapter = adapter;
    this.eventStoreArtifact = abi;
    this.eventStoreContract = contract(this.eventStoreArtifact);
    this.eventStoreContract.setProvider(this.web3.currentProvider);
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
    });
    const instance = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this,
    );
    instance.eventStoreContractInstance = newContract;
    return instance;
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

    const tx = await eventStoreContractInstance.write(
      contentHash,
      { from: fromAddress },
    );
    const { index } = tx.logs[0].args;

    return {
      event: {
        sender: fromAddress,
        content,
        index: index.toNumber(),
      },
      meta: {
        tx,
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
   * Reads specified indexed event from eventStoreContractInstance,
   * retrieves its data from content storage, and returns the original key, value, index, and sender
   * @function
   * @memberof EventStore
   * @name read
   * @param {number} index Index of specified event in eventStoreContractInstance
   * @returns {Object} Event object with original key, value, sender, and index
   */
  async read(index) {
    let events;
    try {
      events = await this.eventStoreContractInstance.getPastEvents('TransmuteEvent', {
        filter: { index: [index] },
        fromBlock: 0,
      });
    } catch (e) {
      throw new Error('Could not read from Ethereum event log');
    }

    if (events.length === 0) {
      throw new Error('No event exists for that index');
    }
    const values = events[0].args;
    let content;
    try {
      content = await this.adapter.readJson(values.contentHash);
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
    /* eslint-disable no-await-in-loop */
    while (index <= endIndex) {
      events.push(await this.read(index));
      index += 1;
    }
    /* eslint-enable no-await-in-loop */
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
    return {
      adapter: !!(await this.adapter.healthy()),
      eventStoreContract: this.eventStoreContractInstance.address,
    };
  }
};
