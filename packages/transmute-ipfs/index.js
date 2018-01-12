var ipfsAPI = require("ipfs-api");

// connect to ipfs daemon API server
var ipfs = ipfsAPI("localhost", "5001", { protocol: "http" });
// leaving out the arguments will default to these values

module.exports = {
  stat: ipfs.repo.stat,
  addDirectory: directoryPath => {
    return new Promise((resolve, reject) => {
      ipfs.util.addFromFs(directoryPath, (err, files) => {
        if (err) {
          reject(err);
        }
        resolve(files);
      });
    });
  }
};
