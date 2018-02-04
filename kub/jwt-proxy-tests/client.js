const fetch = require("node-fetch");
const ipfsAPI = require("ipfs-api");

const ipfs = ipfsAPI({ host: "localhost", port: "5002", protocol: "http" });

const testUrl =
  "http://localhost:8080/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme";

const addDirectory = async (ipfs, directoryPath, ignoreList) => {
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

(async () => {
  // let data;
  //   data = await (await fetch(testUrl, {
  //     method: "GET"
  //   })).text();

  //   //   reject... no header...
  //   console.log(data);

  //   //   accept... head present...
  // data = await (await fetch(testUrl, {
  //   method: "GET",
  //   headers: { "X-TRANSMUTE_AUTH": "GOLDEN_TICKET" }
  // })).text();

  // console.log(data);

  console.log(ipfs)
  
  let nodeInfo = await ipfs.id();
  console.log(nodeInfo);

  //   try {
  //     let data = await addDirectory(ipfs, "./testDir", []);
  //     console.log(data);
  //   } catch (e) {
  //     console.log("Error: ", e);
  //   }
})();
