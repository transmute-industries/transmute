const path = require("path");
const TransmuteIpfs = require("./");

const tests = async () => {
  let TI = new TransmuteIpfs();
  let ignoreList = await TI.getIgnoreList();
  let testDataDir = path.join(__dirname, "./test_data");
  let results = await TI.addDirectory(testDataDir, ignoreList);
  let dappHash = results.pop().hash;
  console.log("http://localhost:8080/ipfs/" + dappHash);
};

tests();
