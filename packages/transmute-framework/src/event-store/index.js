/**
 * A module for reading and writing objects to ipfs and ethereum
 * @module src/event-store
 */

const Web3 = require('web3');
const contract = require('truffle-contract');
const Mixpanel = require('mixpanel');

const TransmuteIpfsAdapter = require('../decentralized-storage/ipfs');
const pack = require('../../package.json');

const GAS = require('../gas')

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
      throw new Error(
        'a config of form { eventStoreArtifact, web3, ipfs } is required.'
      );
    }

    let { eventStoreArtifact, web3Config, mixpanelConfig, ipfsConfig } = config;

    if (!eventStoreArtifact) {
      throw new Error(
        'a truffle-contract eventStoreArtifact property is required in constructor argument.'
      );
    }

    if (!web3Config) {
      throw new Error('a web3 property is required in constructor argument.');
    }

    if (mixpanelConfig && mixpanelConfig.token && mixpanelConfig.token !== '') {
      this.mixpanel = Mixpanel.init(mixpanelConfig.token,
        {
          opt_out_tracking_by_default: mixpanelConfig.optOutOfTracking ? mixpanelConfig.optOutOfTracking : false
        }
      );
    }

    if (!ipfsConfig) {
      throw new Error(
        'an ipfsConfig property is required in constructor argument.'
      );
    }

    this.version = pack.version;

    if (typeof window !== 'undefined' && window.web3) {
      this.web3 = window.web3;
    } else {
      this.web3 = new Web3(
        new Web3.providers.HttpProvider(web3Config.providerUrl)
      );
    }

    this.eventStoreArtifact = eventStoreArtifact;
    this.eventStoreContract = contract(this.eventStoreArtifact);
    this.eventStoreContract.setProvider(this.web3.currentProvider);

    this.ipfs = new TransmuteIpfsAdapter(ipfsConfig);
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
        'You must call init() before accessing eventStoreContractInstance.'
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

  /**
   * Writes a key and value to IPFS, converts the returned Multihash to Bytes32, and writes these values to the eventStoreContractInstance
   * @function
   * @memberof EventStore
   * @name write
   * @param {String} fromAddress Address used to write event to eventStoreContractInstance
   * @param {Object} key Event key
   * @param {Object} value Event value
   * @returns {Object} Event object with original key, value as well as meta from IPFS and Ethereum
   */
  async write(fromAddress, key, value) {
    this.requireInstance();
    const { web3, ipfs, eventStoreContractInstance } = this;

    const keyDagNode = await ipfs.writeObject(key);
    const keyMultihash = keyDagNode._json.multihash;
    const keyBytes32ID = ipfs.multihashToBytes32(keyMultihash);

    const valueDagNode = await ipfs.writeObject(value);
    const valueMultihash = valueDagNode._json.multihash;
    const valueBytes32ID = ipfs.multihashToBytes32(valueMultihash);


    const tx = await eventStoreContractInstance.write(
      keyBytes32ID,
      valueBytes32ID,
      {
        from: fromAddress,
        gas: GAS.EVENT_GAS_COST
      }
    );

    let receipt;

    // MetaMask's Web3 requires that callback be used here.
    if (typeof window !== 'undefined' && window.web3) {
      receipt = web3.eth.getTransactionReceipt(tx, function (error, result) {
        if (!error)
          console.info(result)
        else
          console.error(error);
      });
    } else {
      receipt = web3.eth.getTransactionReceipt(tx);
    }

    return {
      event: {
        sender: fromAddress,
        key,
        value
      },
      meta: {
        tx,
        ipfs: {
          key: keyMultihash,
          value: valueMultihash
        },
        bytes32: {
          key: keyBytes32ID,
          value: valueBytes32ID
        },
        receipt
      }
    };
  }

  /**
   * Reads specified indexed event from eventStoreContractInstance, retrieves its data from IPFS, and returns the original key, value, index, and sender
   * @function
   * @memberof EventStore
   * @name read
   * @param {number} index Index of specified event in eventStoreContractInstance
   * @returns {Object} Event object with original key, value, sender, and index
   */
  async read(index) {
    this.requireInstance();
    const { web3, ipfs, eventStoreContractInstance } = this;

    let values;
    try {
      values = await eventStoreContractInstance.read(index);
    } catch (e) {
      if (index == 0) {
        throw new Error('EventStore has no events.');
      }
    }

    if (!values) {
      throw new Error('Failed to read values from index.');
    }

    const decoded = [
      values[0].toNumber(),
      values[1],
      ipfs.bytes32ToMultihash(values[2]),
      ipfs.bytes32ToMultihash(values[3])
    ];

    return {
      index: decoded[0],
      sender: decoded[1],
      key: await ipfs.readObject(decoded[2]),
      value: await ipfs.readObject(decoded[3])
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
      throw new Error('startIndex must be less than or equal to endIndex.');
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
   * Returns health status of IPFS and eventStoreContractInstance address
   * @function
   * @memberof EventStore
   * @name healthy
   * @returns {Object} Health status of IPFS and eventStoreContractInstance address
   */
  async healthy() {
    this.requireInstance();
    return {
      ipfs: await this.ipfs.healthy(),
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

