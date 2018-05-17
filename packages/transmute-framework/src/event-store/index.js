/**
 * A module for reading and writing objects to ipfs and ethereum.
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
  constructor(config) {
    if (!config) {
      throw new Error(
        'a config of form { eventStoreArtifact, web3, ipfs } is required.'
      );
    }

    let { eventStoreArtifact, web3Config, mixpanelConfig, ipfsConfig, eventStoreAddress } = config;

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

    this.web3 = new Web3(
      new Web3.providers.HttpProvider(web3Config.providerUrl)
    );

    this.eventStoreArtifact = eventStoreArtifact;
    this.eventStoreContract = contract(this.eventStoreArtifact);
    this.eventStoreContract.setProvider(this.web3.currentProvider);

    this.ipfs = new TransmuteIpfsAdapter(ipfsConfig);
  }

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

  async init() {
    if (!this.eventStoreContractInstance) {
      this.eventStoreContractInstance = await this.eventStoreContract.deployed();
    }
  }

  requireInstance() {
    if (!this.eventStoreContractInstance) {
      throw new Error(
        'You must call init() before accessing eventStoreContractInstance.'
      );
    }
  }

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

  async write(fromAddress, key, value) {
    this.requireInstance();
    const { web3, ipfs, eventStoreContractInstance } = this;

    const keyDagNode = await ipfs.writeObject(key);
    const keyMultihash = keyDagNode._json.multihash;
    const keyBytes32ID = ipfs.multihashToBytes32(keyMultihash);

    const valueDagNode = await ipfs.writeObject(value);
    const valueMultihash = valueDagNode._json.multihash;
    const valueBytes32ID = ipfs.multihashToBytes32(valueMultihash);


    const tx = await eventStoreContractInstance.write.sendTransaction(
      keyBytes32ID,
      valueBytes32ID,
      {
        from: fromAddress,
        gas: GAS.EVENT_GAS_COST
      }
    );

    const receipt = web3.eth.getTransactionReceipt(tx);

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

  async healthy() {
    this.requireInstance();
    return {
      ipfs: await this.ipfs.healthy(),
      eventStoreContract: this.eventStoreContractInstance.address
    };
  }

  destroy(address) {
    return this.eventStoreContractInstance.destroy(address);
  }
};
