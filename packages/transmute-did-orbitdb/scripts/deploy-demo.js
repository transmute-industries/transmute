const path = require("path");

const ipfsAPI = require("ipfs-api");

const _ = require("lodash");

const dev = {
  host: "localhost",
  port: "5001",
  protocol: "http",
  gatewayBase: "http://localhost:8080/ipns/"
};

const prod = {
  host: "api.transmute.world",
  port: "443",
  protocol: "https",
  gatewayBase: "https://transmute.world/ipns/"
};

const ipfsOptions = dev;

var ipfs = ipfsAPI(ipfsOptions);

(async () => {
  // const peerInfo = await ipfs.id();
  //   console.log(peerInfo);

  console.log("\nThis may take a few minutes!");

  const addFromFs = (
    folderPath,
    options = {
      recursive: true,
      ignore: ["node_modules/**"]
    }
  ) => {
    return new Promise((resolve, reject) => {
      ipfs.util.addFromFs(folderPath, options, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  };

  const deployedData = await addFromFs(path.resolve(__dirname, "../build"));

  // console.log(deployedData);

  let dirHash = _.find(deployedData, data => {
    return data.path === "build";
  });

  let data = await ipfs.pin.add(dirHash.hash);

  console.log("pinned data: ", data);

  data = await ipfs.name.publish(dirHash.hash);

  console.log("published data: ", data);

  console.log("\n", ipfsOptions.gatewayBase + data.name);
})();
