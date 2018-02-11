
const fse = require("fs-extra");

module.exports.writeFile = async (filePath, fileData) => {
  return new Promise((resolve, reject) => {
    fse.outputFile(filePath, fileData, err => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};


module.exports.readFile = async (filePath) => {
    return new Promise((resolve, reject) => {
      fse.readFile(filePath, (err, fileData) => {
        if (err) {
          reject(err);
        }
        resolve(fileData);
      });
    });
  };
  