const Web3 = require('web3');
const ProviderEngine = require('web3-provider-engine');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js');

const contract = require('truffle-contract');
const KeenTracking = require('keen-tracking');

const TransmuteIpfsAdatper = require('./decentralized-storage/ipfs');
const pack = require('../package.json');

module.exports = class TransmuteEventStore {
  constructor(config) {
    if (!config) {
      throw new Error(
        'a config of form { eventStoreArtifact, web3, keen, ipfs } is required.'
      );
    }

    let { eventStoreArtifact, web3Config, keenConfig, ipfsConfig } = config;

    if (!eventStoreArtifact) {
      throw new Error(
        'a truffle-contract eventStoreArtifact property is required in constructor argument.'
      );
    }

    if (!web3Config) {
      throw new Error('a web3 property is required in constructor argument.');
    }

    if (!keenConfig) {
      throw new Error(
        'a keenConfig property is required in constructor argument.'
      );
    }

    if (!ipfsConfig) {
      throw new Error(
        'an ipfsConfig property is required in constructor argument.'
      );
    }

    var engine = new ProviderEngine();

    engine.addProvider(
      new RpcSubprovider({
        rpcUrl: web3Config.providerUrl
      })
    );

    engine.start();

    this.version = pack.version;

    this.web3 = new Web3(engine);
    this.eventStoreArtifact = eventStoreArtifact;

    this.eventStoreContract = contract(this.eventStoreArtifact);
    this.eventStoreContract.setProvider(this.web3.currentProvider);

    this.keen = new KeenTracking(keenConfig);
    this.ipfs = new TransmuteIpfsAdatper(ipfsConfig);
  }

  async write(obj) {
    const web3 = this.web3;

    const accounts = await web3.eth.getAccounts();
    const instance = await this.eventStoreContract.deployed();
    // let owner = await instance.owner.call();
    const dagNode = await this.ipfs.writeObject(obj);
    const multihash = dagNode._json.multihash;
    const bytes32ID = this.ipfs.multihashToBytes32(multihash);

    const estimatedGasCost = await instance.write.estimateGas(
      bytes32ID,
      bytes32ID
    );

    const tx = await instance.write.sendTransaction(bytes32ID, bytes32ID, {
      from: accounts[0],
      gas: estimatedGasCost + 1050
    });

    const receipt = await web3.eth.getTransactionReceipt(tx);

    console.log('tx: ', tx);
    console.log('receipt: ', receipt);

    // console.log(rec);
    // this.keen.recordEvent('TransmuteEvent', {
    //   key,
    //   value,
    //   rec: rec
    // });
    // return rec;

    return {
      accounts
      // multihash,
      // bytes32ID
    };
  }

  read(index) {
    return this.eventStore.read(index);
  }

  async healthy() {
    let ipfsHealth = await this.ipfs.healthy();
    return ipfsHealth !== undefined;
  }

  destroy(address) {
    return this.eventStore.destroy(address);
  }
};
