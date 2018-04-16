'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault(ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var ipfsApi = _interopDefault(require('ipfs-api'));
var bs58 = _interopDefault(require('bs58'));
var Web3 = _interopDefault(require('web3'));
var truffleContract = _interopDefault(require('truffle-contract'));
var keenTracking = _interopDefault(require('keen-tracking'));

var ipfs = class TransmuteIpfsAdapter {
  constructor(config) {
    this.ipfs = ipfsApi(config);
  }

  healthy() {
    return this.ipfs.id();
  }

  writeObject(obj) {
    return new Promise(function ($return, $error) {
      return $return(this.ipfs.object.put({
        Data: new Buffer(JSON.stringify(obj)),
        Links: []
      }));
    }.bind(this));
  }

  readObject(multihash) {
    return new Promise(function ($return, $error) {
      let data;
      return Promise.resolve(this.ipfs.object.get(multihash)).then(function ($await_1) {
        try {
          data = $await_1.data.toString();
          return $return(JSON.parse(data));
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  }

  bytes32ToMultihash(hash) {
    return bs58.encode(new Buffer('1220' + hash.slice(2), 'hex'));
  }

  multihashToBytes32(ipfshash) {
    return '0x' + new Buffer(bs58.decode(ipfshash).slice(2)).toString('hex');
  }

};

var name = "transmute-eventstore";
var version = "0.0.1";
var description = "EventStore Middleware";
var main = "dist/transmute-eventstore.min.js";
var files = ["dist", "src"];
var scripts = {
  "start": "npm test",
  "build": "./node_modules/bili/dist/cli.js --format cjs ./src/index.js",
  "test": "NODE_TLS_REJECT_UNAUTHORIZED=0 react-scripts test --coverage --forceExit",
  "test:report": "codecov && rm -rf ./coverage",
  "test:smoke": "node ./smoke_tests/module.test.js",
  "truffle:test": "NODE_TLS_REJECT_UNAUTHORIZED=0 truffle test",
  "truffle:migrate": "NODE_TLS_REJECT_UNAUTHORIZED=0 truffle migrate",
  "truffle:coverage": "./node_modules/.bin/solidity-coverage",
  "truffle:coverage:report": "cat coverage/lcov.info | coveralls",
  "eject": "react-scripts eject"
};
var repository = {
  "type": "git",
  "url": "git+ssh://git@github.com/transmute-industries/transmute.git"
};
var keywords = ["transmute"];
var authors = ["Orie Steele <orie@transmute.industries>"];
var license = "MIT";
var bugs = {
  "url": "https://github.com/transmute-industries/transmute/issues"
};
var homepage = "https://github.com/transmute-industries/transmute#readme";
var devDependencies = {
  "bili": "^3.0.4",
  "codecov": "^3.0.0",
  "coveralls": "^3.0.0",
  "react-scripts": "^1.1.1",
  "solidity-coverage": "^0.4.14"
};
var dependencies = {
  "bs58": "^4.0.1",
  "ipfs-api": "^18.2.0",
  "keen-tracking": "^1.1.3",
  "truffle-contract": "^3.0.4",
  "web3": "^0.19.1",
  "web3-provider-engine": "^13.6.6",
  "zeppelin-solidity": "^1.6.0"
};
var _package = {
  name: name,
  version: version,
  description: description,
  main: main,
  files: files,
  scripts: scripts,
  repository: repository,
  keywords: keywords,
  authors: authors,
  license: license,
  bugs: bugs,
  homepage: homepage,
  devDependencies: devDependencies,
  dependencies: dependencies
};

var _package$1 = /*#__PURE__*/Object.freeze({
  name: name,
  version: version,
  description: description,
  main: main,
  files: files,
  scripts: scripts,
  repository: repository,
  keywords: keywords,
  authors: authors,
  license: license,
  bugs: bugs,
  homepage: homepage,
  devDependencies: devDependencies,
  dependencies: dependencies,
  default: _package
});

const MAX_GAS = 1000000;
const EVENT_GAS_COST = 500000;
var gas = {
  MAX_GAS,
  EVENT_GAS_COST
};

var pack = (_package$1 && _package) || _package$1;

var eventStoreFactory = class EventStoreFactory {
  constructor(config) {
    if (!config) {
      throw new Error('a config of form { eventStoreFactoryArtifact, web3, keen } is required.');
    }

    let eventStoreFactoryArtifact = config.eventStoreFactoryArtifact,
      web3Config = config.web3Config,
      keenConfig = config.keenConfig;

    if (!eventStoreFactoryArtifact) {
      throw new Error('a truffle-contract eventStoreFactoryArtifact property is required in constructor argument.');
    }

    if (!web3Config) {
      throw new Error('a web3 property is required in constructor argument.');
    }

    if (!keenConfig) {
      throw new Error('a keenConfig property is required in constructor argument.');
    }

    this.version = pack.version;
    this.web3 = new Web3(new Web3.providers.HttpProvider(web3Config.providerUrl));
    this.eventStoreFactoryArtifact = eventStoreFactoryArtifact;
    this.eventStoreFactoryContract = truffleContract(this.eventStoreFactoryArtifact);
    this.eventStoreFactoryContract.setProvider(this.web3.currentProvider);
    this.keen = new keenTracking(keenConfig);
  }

  getWeb3Accounts() {
    return new Promise(function ($return, $error) {
      return $return(new Promise((resolve, reject) => {
        this.web3.eth.getAccounts((err, accounts) => {
          if (err) {
            reject(err);
          }

          resolve(accounts);
        });
      }));
    }.bind(this));
  }

  init() {
    return new Promise(function ($return, $error) {
      if (!this.eventStoreFactoryContractInstance) {
        return Promise.resolve(this.eventStoreFactoryContract.deployed()).then(function ($await_2) {
          try {
            this.eventStoreFactoryContractInstance = $await_2;
            return $If_1.call(this);
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      }

      function $If_1() {
        return $return();
      }

      return $If_1.call(this);
    }.bind(this));
  }

  requireInstance() {
    if (!this.eventStoreFactoryContractInstance) {
      throw new Error('You must call init() before accessing eventStoreFactoryContractInstance.');
    }
  }

  clone(fromAddress) {
    return new Promise(function ($return, $error) {
      var newContract;
      let instance;
      return Promise.resolve(this.eventStoreFactoryContract.new({
        from: fromAddress,
        gas: gas.MAX_GAS
      })).then(function ($await_3) {
        try {
          newContract = $await_3;
          instance = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
          instance.eventStoreFactoryContractInstance = newContract;
          return $return(instance);
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  }

  createEventStore(fromAddress) {
    return new Promise(function ($return, $error) {
      this.requireInstance();
      return Promise.resolve(this.eventStoreFactoryContractInstance.createEventStore({
        from: fromAddress,
        gas: gas.MAX_GAS
      })).then($return, $error);
    }.bind(this));
  }

  getEventStores() {
    return new Promise(function ($return, $error) {
      this.requireInstance();
      return Promise.resolve(this.eventStoreFactoryContractInstance.getEventStores()).then($return, $error);
    }.bind(this));
  }

  destroy(fromAddress, address) {
    return new Promise(function ($return, $error) {
      this.requireInstance();
      return Promise.resolve(this.eventStoreFactoryContractInstance.destroy(address, {
        from: fromAddress,
        gas: gas.MAX_GAS
      })).then($return, $error);
    }.bind(this));
  }

};

var eventStore = class EventStore {
  constructor(config) {
    if (!config) {
      throw new Error('a config of form { eventStoreArtifact, web3, keen, ipfs } is required.');
    }

    let eventStoreArtifact = config.eventStoreArtifact,
      web3Config = config.web3Config,
      keenConfig = config.keenConfig,
      ipfsConfig = config.ipfsConfig,
      eventStoreAddress = config.eventStoreAddress;

    if (!eventStoreArtifact) {
      throw new Error('a truffle-contract eventStoreArtifact property is required in constructor argument.');
    }

    if (!web3Config) {
      throw new Error('a web3 property is required in constructor argument.');
    }

    if (!keenConfig) {
      throw new Error('a keenConfig property is required in constructor argument.');
    }

    if (!ipfsConfig) {
      throw new Error('an ipfsConfig property is required in constructor argument.');
    }

    this.version = pack.version;
    this.web3 = new Web3(new Web3.providers.HttpProvider(web3Config.providerUrl));
    this.eventStoreArtifact = eventStoreArtifact;
    this.eventStoreContract = truffleContract(this.eventStoreArtifact);
    this.eventStoreContract.setProvider(this.web3.currentProvider);
    this.keen = new keenTracking(keenConfig);
    this.ipfs = new ipfs(ipfsConfig);
  }

  getWeb3Accounts() {
    return new Promise(function ($return, $error) {
      return $return(new Promise((resolve, reject) => {
        this.web3.eth.getAccounts((err, accounts) => {
          if (err) {
            reject(err);
          }

          resolve(accounts);
        });
      }));
    }.bind(this));
  }

  init() {
    return new Promise(function ($return, $error) {
      if (!this.eventStoreContractInstance) {
        return Promise.resolve(this.eventStoreContract.deployed()).then(function ($await_5) {
          try {
            this.eventStoreContractInstance = $await_5;
            return $If_2.call(this);
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      }

      function $If_2() {
        return $return();
      }

      return $If_2.call(this);
    }.bind(this));
  }

  requireInstance() {
    if (!this.eventStoreContractInstance) {
      throw new Error('You must call init() before accessing eventStoreContractInstance.');
    }
  }

  clone(fromAddress) {
    return new Promise(function ($return, $error) {
      var newContract;
      let instance;
      return Promise.resolve(this.eventStoreContract.new({
        from: fromAddress,
        gas: gas.MAX_GAS
      })).then(function ($await_6) {
        try {
          newContract = $await_6;
          instance = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
          instance.eventStoreContractInstance = newContract;
          return $return(instance);
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  }

  write(fromAddress, key, value) {
    return new Promise(function ($return, $error) {
      var web3, ipfs$$1, eventStoreContractInstance, keyDagNode, keyMultihash, keyBytes32ID, valueDagNode, valueMultihash, valueBytes32ID, tx, receipt;
      this.requireInstance();
      web3 = this.web3, ipfs$$1 = this.ipfs, eventStoreContractInstance = this.eventStoreContractInstance;
      return Promise.resolve(ipfs$$1.writeObject(key)).then(function ($await_7) {
        try {
          keyDagNode = $await_7;
          keyMultihash = keyDagNode._json.multihash;
          keyBytes32ID = ipfs$$1.multihashToBytes32(keyMultihash);
          return Promise.resolve(ipfs$$1.writeObject(value)).then(function ($await_8) {
            try {
              valueDagNode = $await_8;
              valueMultihash = valueDagNode._json.multihash;
              valueBytes32ID = ipfs$$1.multihashToBytes32(valueMultihash);
              return Promise.resolve(eventStoreContractInstance.write.sendTransaction(keyBytes32ID, valueBytes32ID, {
                from: fromAddress,
                gas: gas.EVENT_GAS_COST
              })).then(function ($await_9) {
                try {
                  tx = $await_9;
                  receipt = web3.eth.getTransactionReceipt(tx);
                  return $return({
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
                  });
                } catch ($boundEx) {
                  return $error($boundEx);
                }
              }.bind(this), $error);
            } catch ($boundEx) {
              return $error($boundEx);
            }
          }.bind(this), $error);
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  }

  read(index) {
    return new Promise(function ($return, $error) {
      var web3, ipfs$$1, eventStoreContractInstance, decoded;
      let values;
      this.requireInstance();
      web3 = this.web3, ipfs$$1 = this.ipfs, eventStoreContractInstance = this.eventStoreContractInstance;

      var $Try_1_Post = function () {
        try {
          if (!values) {
            return $error(new Error('Failed to read values from index.'));
          }

          decoded = [values[0].toNumber(), values[1], ipfs$$1.bytes32ToMultihash(values[2]), ipfs$$1.bytes32ToMultihash(values[3])];
          return Promise.resolve(ipfs$$1.readObject(decoded[2])).then(function ($await_10) {
            try {
              return Promise.resolve(ipfs$$1.readObject(decoded[3])).then(function ($await_11) {
                try {
                  return $return({
                    index: decoded[0],
                    sender: decoded[1],
                    key: $await_10,
                    value: $await_11
                  });
                } catch ($boundEx) {
                  return $error($boundEx);
                }
              }.bind(this), $error);
            } catch ($boundEx) {
              return $error($boundEx);
            }
          }.bind(this), $error);
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this);

      var $Try_1_Catch = function (e) {
        try {
          if (index == 0) {
            throw new Error('EventStore has no events.');
          }

          return $Try_1_Post();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this);

      try {
        return Promise.resolve(eventStoreContractInstance.read(index)).then(function ($await_12) {
          try {
            values = $await_12;
            return $Try_1_Post();
          } catch ($boundEx) {
            return $Try_1_Catch($boundEx);
          }
        }.bind(this), $Try_1_Catch);
      } catch (e) {
        $Try_1_Catch(e);
      }
    }.bind(this));
  }

  getSlice(startIndex, endIndex) {
    return new Promise(function ($return, $error) {
      let index, events;

      if (!(endIndex >= startIndex)) {
        return $error(new Error('startIndex must be less than or equal to endIndex.'));
      }

      index = startIndex;
      events = [];
      var $Loop_3_trampoline;
      return ($Loop_3_trampoline = function (q) {
        while (q) {
          if (q.then) return void q.then($Loop_3_trampoline, $error);

          try {
            if (q.pop) {
              if (q.length) return q.pop() ? $Loop_3_exit.call(this) : q; else q = $Loop_3;
            } else q = q.call(this);
          } catch (_exception) {
            return $error(_exception);
          }
        }
      }.bind(this))($Loop_3);

      function $Loop_3() {
        if (index <= endIndex) {
          return Promise.resolve(this.read(index)).then(function ($await_13) {
            try {
              events.push($await_13);
              index++;
              return $Loop_3;
            } catch ($boundEx) {
              return $error($boundEx);
            }
          }.bind(this), $error);
        } else return [1];
      }

      function $Loop_3_exit() {
        return $return(events);
      }
    }.bind(this));
  }

  healthy() {
    return new Promise(function ($return, $error) {
      this.requireInstance();
      return Promise.resolve(this.ipfs.healthy()).then(function ($await_14) {
        try {
          return $return({
            ipfs: $await_14,
            eventStoreContract: this.eventStoreContractInstance.address
          });
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  }

  destroy(address) {
    return this.eventStoreContractInstance.destroy(address);
  }

};

var streamModel = class StreamModel {
  constructor(eventStore, filter, reducer, state) {
    Object.defineProperty(this, "applyEvent", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: event => {
        this.state.model = this.reducer(this.state.model, event);
        this.state.lastIndex = event.index;
      }
    });
    Object.defineProperty(this, "applyEvents", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: events => {
        events.filter(this.filter).map(this.applyEvent);
      }
    });
    Object.defineProperty(this, "sync", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: () => new Promise(function ($return, $error) {
        var web3, eventCount, updates;
        web3 = this.eventStore.web3;
        return Promise.resolve(this.eventStore.eventStoreContractInstance.count.call()).then(function ($await_2) {
          try {
            eventCount = $await_2.toNumber();

            if (eventCount === 0) {
              return $return();
            }

            if (this.state.lastIndex == null || this.state.lastIndex < eventCount) {
              return Promise.resolve(this.eventStore.getSlice(this.state.lastIndex || 0, eventCount - 1)).then(function ($await_3) {
                try {
                  updates = $await_3;
                  this.applyEvents(updates);
                  return $If_1.call(this);
                } catch ($boundEx) {
                  return $error($boundEx);
                }
              }.bind(this), $error);
            }

            function $If_1() {
              return $return();
            }

            return $If_1.call(this);
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      }.bind(this))
    });
    eventStore.requireInstance();
    this.eventStore = eventStore;
    this.filter = filter;
    this.reducer = reducer;
    this.state = state || {
      contractAddress: this.eventStore.eventStoreContractInstance.address,
      model: {},
      lastIndex: null
    };
  }

};

var src = {
  EventStoreFactory: eventStoreFactory,
  EventStore: eventStore,
  StreamModel: streamModel,
  IpfsAdapter: ipfs
};
var src_1 = src.EventStoreFactory;
var src_2 = src.EventStore;
var src_3 = src.StreamModel;
var src_4 = src.IpfsAdapter;

exports.default = src;
exports.EventStoreFactory = src_1;
exports.EventStore = src_2;
exports.StreamModel = src_3;
exports.IpfsAdapter = src_4;
