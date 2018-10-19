/**
 * A module for creating and destroying EventStores
 * @module src/event-store-factory
 */

const contract = require('truffle-contract');

const pack = require('../../package.json');

const GAS = require('../gas');

/** @class EventStoreFactory */
module.exports = class EventStoreFactory {
  /**
   * Creates a new EventStoreFactory.
   * @constructor
   * @memberof EventStoreFactory
   * @param {Object} config Config object requiring eventStoreFactoryArtifact
   * and web3Config with optional mixpanelConfig
   */
  constructor(config) {
    if (!config) {
      throw new Error('a config of form { web3, abi, adapter } is required.');
    }

    const { web3, abi } = config;

    if (!web3) {
      throw new Error('a web3 property is required in constructor argument.');
    }

    if (!abi) {
      throw new Error(
        'a truffle-contract abi property is required in constructor argument.',
      );
    }

    this.version = pack.version;
    this.web3 = web3;

    this.eventStoreFactoryArtifact = abi;
    this.eventStoreFactoryContract = contract(this.eventStoreFactoryArtifact);
    this.eventStoreFactoryContract.setProvider(this.web3.currentProvider);
  }

  /**
   * Returns Web3 accounts
   * @function
   * @memberof EventStoreFactory
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
   * Deploys eventStoreFactoryContract if it has not already been deployed
   * @function
   * @memberof EventStoreFactory
   * @name init
   */
  async init() {
    if (!this.eventStoreFactoryContractInstance) {
      this.eventStoreFactoryContractInstance = await this.eventStoreFactoryContract.deployed();
    }
  }

  /**
   * Throws error if init() has not been called
   * @function
   * @memberof EventStoreFactory
   * @name requireInstance
   */
  requireInstance() {
    if (!this.eventStoreFactoryContractInstance) {
      throw new Error(
        'You must call init() before accessing eventStoreFactoryContractInstance.',
      );
    }
  }

  /**
   * Creates EventStoreFactory instance and assigns it a new EventStoreFactoryContract
   * @function
   * @memberof EventStoreFactory
   * @name clone
   * @param {String} fromAddress Address used to create new EventStoreFactoryContract
   * @returns {Object} EventStoreFactory instance
   */
  async clone(fromAddress) {
    const newContract = await this.eventStoreFactoryContract.new({
      from: fromAddress,
      gas: GAS.MAX_GAS,
    });
    const instance = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this,
    );
    instance.eventStoreFactoryContractInstance = newContract;
    return instance;
  }

  /**
   * Creates EventStore with eventStoreFactoryContractInstance
   * @function
   * @memberof EventStoreFactory
   * @name createEventStore
   * @param {String} fromAddress Address used to create new EventStore
   * @returns {Object} Ethereum transaction from EventStore creation
   */
  async createEventStore(fromAddress) {
    this.requireInstance();
    return this.eventStoreFactoryContractInstance.createEventStore({
      from: fromAddress,
      gas: GAS.MAX_GAS,
    });
  }

  /**
   * Returns Array of EventStore addresses that were created with eventStoreFactoryContractInstance
   * @function
   * @memberof EventStoreFactory
   * @name getEventStores
   * @returns {Array.<String>} Array of EventStore addresses
   */
  async getEventStores() {
    this.requireInstance();
    return this.eventStoreFactoryContractInstance.getEventStores();
  }

  /**
   * Destroys eventStoreFactoryContractInstance and returns remaining ETH to address
   * @function
   * @memberof EventStoreFactory
   * @name destroy
   * @param {String} fromAddress Address used to destroy eventStoreFactoryContractInstance
   * @param {String} address Address receiving remaining ETH from eventStoreFactoryContractInstance
   * @returns {Object} Ethereum transaction from EventStore destruction
   */
  async destroy(fromAddress, address) {
    this.requireInstance();
    return this.eventStoreFactoryContractInstance.destroy(address, {
      from: fromAddress,
      gas: GAS.MAX_GAS,
    });
  }
};
