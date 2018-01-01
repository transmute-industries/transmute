const ipfsAPI = require("ipfs-api");

const ipld = require("ipld-dag-cbor");
const jiff = require("jiff");

import * as _ from "lodash";

// IPFS Gateway
// https://ipfs.infura.io
// IPFS RPC
// https://ipfs.infura.io:5001

export interface IIpfsConfig {
  host: string;
  port: string;
  options: {
    protocol: any;
  };
}

export interface ITransmuteIpfs {
  ipfs: any;
  isObjectStore: boolean;
  config: IIpfsConfig;
  init: (config: IIpfsConfig) => ITransmuteIpfs;
  addFromFs: (path: string) => Promise<any>;
  addFromURL: (url: string) => Promise<any>;
  writeObject: (obj: any) => Promise<any>;
  readObject: (hash: string) => Promise<any>;
  statesToPatches: (states: any[]) => Promise<any>;
  patchesToHashes: (patches: any[]) => Promise<any>;
  hashesToPatches: (hashes: string[]) => Promise<any>;
  applyPatches: (obj: any, patches: any[]) => any;
  applyIPLDHashes: (obj: any, hashes: string[]) => Promise<any>;
  diff: (start: any, end: any) => any;
  patch: (target: any, patch: any) => any;
}

export class TransmuteIpfsSingleton implements ITransmuteIpfs {
  ipfs: any;
  isObjectStore: boolean = true; //used to tell if objects are stored on ipfs or in ethereum... pretty hacky...
  config: IIpfsConfig;
  init(
    config = {
      host: "localhost",
      port: "5001",
      options: {
        protocol: "http"
      }
    }
  ) {
    this.config = config;
    this.ipfs = ipfsAPI(
      this.config.host,
      this.config.port,
      this.config.options
    );
    return this;
  }

  addFromFs(
    folderPath,
    options = {
      recursive: true,
      ignore: ["node_modules/**"]
    }
  ) {
    return new Promise((resolve, reject) => {
      this.ipfs.util.addFromFs(folderPath, options, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }

  addFromURL(url) {
    return new Promise((resolve, reject) => {
      this.ipfs.util.addFromURL(url, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }

  writeBuffer(buffer) {
    return new Promise((resolve, reject) => {
      this.ipfs.add(buffer, (err, res) => {
        if (err || !res) {
          reject(err);
        }
        resolve(res[0].path);
      });
    });
  }

  writeObject(obj) {
    return new Promise((resolve, reject) => {
      ipld.util.serialize(obj, (err, serialized) => {
        if (err) {
          reject(err);
        }
        resolve(this.writeBuffer(serialized));
      });
    });
  }

  readBuffer(hash) {
    return new Promise((resolve, reject) => {
      this.ipfs.cat(hash, (err, stream) => {
        if (err) {
          reject(err);
        }
        let data = new Buffer("");
        stream.on("data", chunk => {
          data = Buffer.concat([data, chunk]);
        });
        stream.on("end", () => {
          resolve(data);
        });
      });
    });
  }

  readObject(path) {
    if (path.indexOf("ipfs/") !== -1) {
      path = path.split("ipfs/")[1];
    }
    return this.readBuffer(path).then((serialized: any) => {
      return new Promise((resolve, reject) => {
        ipld.util.deserialize(serialized, (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
      });
    });
  }

  // See https://github.com/cujojs/jiff
  statesToPatches(states) {
    return new Promise((resolve, reject) => {
      let patches: any[] = [];
      for (let i = 0; i <= states.length - 2; i++) {
        patches.push(jiff.diff(states[i], states[i + 1]));
      }
      resolve(patches);
    });
  }

  patchesToHashes(patches) {
    return new Promise(async (resolve, reject) => {
      let marshalledPatches = patches.map(patch => {
        // return ipld.marshal(patch)
        return new Promise((resolve, reject) => {
          ipld.util.serialize(patch, (err, serialized) => {
            if (err) {
              reject(err);
            }
            resolve(serialized);
          });
        });
      });
      let buffers = await Promise.all(marshalledPatches);
      let promises = buffers.map(mp => {
        return this.writeBuffer(mp);
      });
      resolve(Promise.all(promises));
    });
  }

  hashesToPatches = async hashes => {
    let marshalledPatches = await Promise.all(
      hashes.map(hash => {
        return this.readBuffer(hash);
      })
    );
    let promises = await marshalledPatches.map((marshalled: string) => {
      return new Promise((resolve, reject) => {
        ipld.util.deserialize(new Buffer(marshalled), (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
      });
    });

    return Promise.all(promises);
  };

  applyPatches = (obj, patches) => {
    let patched = _.cloneDeep(obj);
    patches.forEach(patch => {
      patched = jiff.patchInPlace(patch, patched);
    });
    return patched;
  };

  applyIPLDHashes = async (obj, hashes) => {
    let patches = await this.hashesToPatches(hashes);
    return this.applyPatches(obj, patches);
  };

  patch = (target, patch) => {
    return jiff.patchInPlace(patch, target);
  };

  diff = (start, end) => {
    return jiff.diff(start, end);
  };
}

export var TransmuteIpfs = new TransmuteIpfsSingleton();
