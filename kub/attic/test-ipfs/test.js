const TransmuteIPFS = require("transmute-ipfs");

const ti = new TransmuteIPFS();

(async () => {
  let nodeInfo = await ti.ipfs.id();
  console.log(nodeInfo.id);
  let ignoreList = await ti.getIgnoreList();
  let hashes = await ti.addDirectory("./app", ignoreList);
  let appHash = hashes[hashes.length-1].hash
  console.log('http://localhost:8080/ipfs/' + appHash)
})();
