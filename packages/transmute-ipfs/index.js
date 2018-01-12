var fs = require("fs");
var ipfsAPI = require("ipfs-api");

const readFile = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", function(err, contents) {
      if (err) {
        reject(err);
      }
      resolve(contents);
    });
  });
};

module.exports = class TransmuteIpfs {
  constructor(host = "localhost", port = "5001", protocol = "http") {
    this.ipfs = ipfsAPI(host, port, { protocol: protocol });
  }

  async getIgnoreList() {
    const gitignore = await readFile(".gitignore");
    const npmignore = await readFile(".npmignore");
    const ignoreList = [gitignore, npmignore]
      .map(file => file.split("\n"))
      .reduce((acc, cur) => acc.concat(cur));
    return ignoreList;
  }

  async addDirectory(directoryPath, ignoreList) {
    return new Promise((resolve, reject) => {
      this.ipfs.util.addFromFs(
        directoryPath,
        { recursive: true, ignore: ignoreList },
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
  }
};
