const path = require("path");

var fs = require("fs");

var ipfsAPI = require("ipfs-api");

// connect to ipfs daemon API server
var ipfs = ipfsAPI("localhost", "5001", { protocol: "http" });
// leaving out the arguments will default to these values

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

const addDir = async (directoryPath, ignoreList) => {
  return new Promise((resolve, reject) => {
    ipfs.util.addFromFs(
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
};

const tests = async () => {
  let gitignore = await readFile(".gitignore");
  let npmignore = await readFile(".npmignore");
  let ignoreList = [gitignore, npmignore]
    .map(file => file.split("\n"))
    .reduce((acc, cur) => acc.concat(cur));
  // console.log(ignoreList);
  let testDataDir = path.join(__dirname, "./test_data");
  let results = await addDir(testDataDir, ignoreList);
  let dappHash = results.pop().hash;
  console.log("http://localhost:8080/ipfs/" + dappHash);
};

tests();
