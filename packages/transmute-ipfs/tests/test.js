const path = require("path");
const TransmuteIpfs = require("../");

let TI = new TransmuteIpfs();

const tests = async () => {
  // let id = await TI.ipfs.id()
  // console.log(id)
  let ignoreList = await TI.getIgnoreList();
  let testDataDir = path.join(__dirname, "../data/dapp1");
  let results = await TI.addDirectory(testDataDir, ignoreList);
  let dappHash = results.pop().hash;
  console.log("http://localhost:8080/ipfs/" + dappHash);

  testDataDir = path.join(__dirname, "../data/dapp2");
  results = await TI.addDirectory(testDataDir, ignoreList);
  dappHash = results.pop().hash;
  console.log("http://localhost:8080/ipfs/" + dappHash);

  console.log('\nTests complete.')
  
  // http://localhost:8080/ipfs/Qme7DMBUe1EjXAKoEXzNh7G7NgMeGw9i2uLfB9bKVR7hHZ
  // http://localhost:8080/ipfs/QmYG8q3btc4xb3GhtdQzwdxtuZiAoxGKNS9sMBrqDKNws2
};

tests();
