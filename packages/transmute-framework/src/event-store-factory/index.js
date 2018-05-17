const Web3 = require('web3');
const contract = require('truffle-contract');
const Mixpanel = require('mixpanel');

const TransmuteIpfsAdapter = require('../decentralized-storage/ipfs');
const pack = require('../../package.json');

const GAS = require('../gas')

module.exports = class EventStoreFactory {
  constructor(config) {
    if (!config) {
      throw new Error(
        'a config of form { eventStoreFactoryArtifact, web3 } is required.'
      );
    }

    let { eventStoreFactoryArtifact, web3Config, mixpanelConfig } = config;

    if (!eventStoreFactoryArtifact) {
      throw new Error(
        'a truffle-contract eventStoreFactoryArtifact property is required in constructor argument.'
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

    this.version = pack.version;

    this.web3 = new Web3(
      new Web3.providers.HttpProvider(web3Config.providerUrl)
    );

    this.eventStoreFactoryArtifact = eventStoreFactoryArtifact;
    this.eventStoreFactoryContract = contract(this.eventStoreFactoryArtifact);
    this.eventStoreFactoryContract.setProvider(this.web3.currentProvider);
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
    if (!this.eventStoreFactoryContractInstance) {
      this.eventStoreFactoryContractInstance = await this.eventStoreFactoryContract.deployed();
    }
  }

  requireInstance() {
    if (!this.eventStoreFactoryContractInstance) {
      throw new Error(
        'You must call init() before accessing eventStoreFactoryContractInstance.'
      );
    }
  }

  async clone(fromAddress) {
    const newContract = await this.eventStoreFactoryContract.new({
      from: fromAddress,
      gas: GAS.MAX_GAS
    });
    let instance = Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this
    );
    instance.eventStoreFactoryContractInstance = newContract;
    return instance;
  }

  async createEventStore(fromAddress) {
    this.requireInstance();
    return await this.eventStoreFactoryContractInstance.createEventStore({ 
      from: fromAddress,
      gas: GAS.MAX_GAS
    });
  }

  async getEventStores() {
    this.requireInstance();
    return await this.eventStoreFactoryContractInstance.getEventStores();
  }

  async destroy(fromAddress, address) {
    this.requireInstance();
    return await this.eventStoreFactoryContractInstance.destroy(address, {
      from: fromAddress,
      gas: GAS.MAX_GAS
    });
  }
};
