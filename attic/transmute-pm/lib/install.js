
// show all packages that have been published

const fse = require("fs-extra");
const path = require("path");

var ipfsAPI = require("ipfs-api");
var ipfs = ipfsAPI({ host: "localhost", port: "5001", protocol: "http" });

const { getPackageManagerReadModel, filterModelToLatest } = require("./common");

const writeFile = (targetPath, data) => {
  return new Promise((resolve, reject) => {
    fse.outputFile(targetPath, data, err => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};


const writePackage = async (cid, targetPath) => {
  return new Promise((resolve, reject) => {
    ipfs.files.get(cid, async (err, files) => {
      let promiseToWriteFiles = files.map(async (file) =>{
        if (file.content) {
          let localPath = file.path.replace(cid, targetPath);
          return await writeFile(localPath, file.content.toString("utf8"));
        }
      })
      await Promise.all(promiseToWriteFiles);
      resolve(true);
    });
  });
};

// Example ReadModel
// {
//   readModelStoreKey: "PackageMangager:0xa8557e2463e2e478b2c59274e612b91753f39717",
//   readModelType: "PackageMangager",
//   contractAddress: "0xa8557e2463e2e478b2c59274e612b91753f39717",
//   lastEvent: 3,
//   model: {
//     QmU38PjH6AJGqYdVgRq6yHkPkV4DETrfUX6Cwjfk9PYMx4: {
//       name: "dapp",
//       version: "1.0.0"
//     },
//     QmaA3oJkzbG39ut3Ajr9faVcwDRKSH1kp9FANuWAaASRsF: {
//       name: "oracle",
//       version: "1.0.0"
//     },
//     Qme4h5aNTveLGJVeELmvqdtYE6d9UdcfB8Lm2cx5Tpn2GQ: {
//       name: "oracle",
//       version: "2.0.0"
//     },
//     QmV9bGPVLTqkQWm2Lhd6c6UuD8az4iGkyAUBZD7ExNbYY2: {
//       name: "dapp",
//       version: "2.0.0"
//     }
//   }
// };

// installs latest version of all packages in ./example, pulling the data for each from ipfs
const installPackages = async (T, eventStore, fromAddress, targetDirectory) => {
  let readModel = await getPackageManagerReadModel(T, eventStore, fromAddress);
  let latestPackages = filterModelToLatest(readModel);

  let promises = Object.keys(latestPackages).map(async packageName => {
    let meta = latestPackages[packageName];
    let targetPath = path.join(targetDirectory, meta.name);
    return await writePackage(meta.index, targetPath);
  });
  
  return await Promise.all(promises);
};

module.exports = installPackages;
