// show all packages that have been published
const { getPackageManagerReadModel } = require("./common");

const fse = require('fs-extra');

var ipfsAPI = require("ipfs-api");
var ipfs = ipfsAPI({ host: "localhost", port: "5001", protocol: "http" });

let cid = "/ipfs/QmU38PjH6AJGqYdVgRq6yHkPkV4DETrfUX6Cwjfk9PYMx4";

const writeFile = (path, data) => {
  return new Promise((resolve, reject) => {
    fse.outputFile(path, data, err => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};

const writePackage = async (cid, path) => {
  return new Promise((resolve, reject) => {
    ipfs.files.get(cid, (err, files) => {
      //   console.log(files);
      files.forEach(async file => {
        if (file.content) {
          let localPath = file.path.replace(cid, path);
          resolve(await writeFile(localPath, file.content.toString("utf8")));
        }
      });
    });
  });
};

const installPackages = async (T, eventStore, fromAddress) => {
  let readModel = await getPackageManagerReadModel(T, eventStore, fromAddress);
  // console.log("install via this readModel: ", readModel);
  // console.log(T.TransmuteIpfs)
  // super NOT COOL way to install files...
  // should resolve readmodel to latest versions and only install those...
  // this is mutating the package directory with each published version... kinda cool, but not.
  Object.keys(readModel.model).forEach(async packageKey => {
    let meta = readModel.model[packageKey]
    await writePackage(packageKey, "./example/" + meta.name );
  });
};

module.exports = installPackages;
