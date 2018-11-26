const path = require("path");
const ipfsAPI = require("ipfs-api");
const _ = require("lodash");
const pack = require("../package.json");

const ipfsOptions = pack.ipfsOptions[process.argv[2]];
const ipfs = ipfsAPI(ipfsOptions);

(async () => {
  console.log("deploying...");

  const addedData = await ipfs.util.addFromFs(
    path.resolve(__dirname, "../build"),
    {
      recursive: true
    }
  );

  console.log("addedData: ", addedData);

  const buildRootHash = _.find(addedData, data => {
    return data.path === "build";
  });

  const pinnedData = await ipfs.pin.add(buildRootHash.hash);
  console.log("\npinnedData: ", pinnedData);

  const publishedData = await ipfs.name.publish(buildRootHash.hash);
  console.log("\npublishedData: ", publishedData);
  console.log("\n", ipfsOptions.gatewayBase + publishedData.name);
})();
