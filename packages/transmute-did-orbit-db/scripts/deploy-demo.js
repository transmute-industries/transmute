const path = require("path");
const fs = require("fs");

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

const ipfsOptions = prod;

var ipfs = ipfsAPI(ipfsOptions);

var walkSync = function(dir, filelist) {
  var files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist.push({
        path: path.join(dir, file),
        dir: true
      });
      filelist = walkSync(path.join(dir, file), filelist);
    } else {
      if (file.indexOf(".DS_Store") !== -1) {
        return;
      }
      filelist.push({
        path: path.join(dir, file),
        content: fs.readFileSync(path.join(dir, file))
      });
    }
  });
  return filelist;
};

const testUpload = async ipfs => {
  let data = await ipfs.add([
    {
      path: "mydir",
      dir: true
    },
    {
      path: "mydir/myfile",
      content: Buffer.from("hello")
    },
    {
      path: "mydir/mydir2",
      dir: true
    },
    {
      path: "mydir/mydir2/myfile2",
      content: Buffer.from("hello2")
    }
  ]);

  console.log("data: ", data);

  const pinnedData = await Promise.all(
    data.map(p => {
      return ipfs.pin.add(p.hash);
    })
  );
  console.log("pinnedData: ", pinnedData);

  const buildRootHash = _.find(data, data => {
    return data.path === "mydir";
  });
  if (buildRootHash) {
    const publishedData = await ipfs.name.publish(buildRootHash.hash);
    console.log("publishedData: ", publishedData);
  }

  console.log(data);
};

const getData = async () => {
  const dirPath = path.resolve(__dirname, "../build/");
  var filelist = [
    {
      path: "build",
      dir: true
    }
  ];
  walkSync(dirPath, filelist);
  return filelist.map(d => {
    return {
      ...d,
      path: d.path.replace(dirPath, "build")
    };
  });
};

const uploadAllData = async (ipfs, data) => {
  if (data.length) {
    const uploadedData = await ipfs.add(data);
    console.log("uploadedData: ", uploadedData);
    console.log("\n...");
    const uploadedPaths = _.map(uploadedData, d => {
      return d.path;
    });

    // const pinnedData = await Promise.all(
    //   uploadedPaths.map(p => {
    //     return ipfs.pin.add(p.hash);
    //   })
    // );
    // console.log("pinnedData: ", pinnedData);

    const buildRootHash = _.find(uploadedData, data => {
      return data.path === "build";
    });
    if (buildRootHash) {
      const publishedData = await ipfs.name.publish(buildRootHash.hash);
      console.log("publishedData: ", publishedData);
    }

    const remainingData = _.filter(data, d => {
      return uploadedPaths.indexOf(d.path) === -1;
    });
    await uploadAllData(ipfs, remainingData);
  } else {
    console.log("add done..");
  }
};

const simpleUpload = async () => {
  const dirPath = path.resolve(__dirname, "../build/");
  console.log(`\nAdding... ${dirPath}\n\nThis may take a few minutes!\n`);
  let deployedData = await ipfs.util.addFromFs(dirPath, {
    recursive: true
    // ignore: ["node_modules"]
  });
  console.log(deployedData);

  const buildRootHash = _.find(deployedData, data => {
    return data.path === "build";
  });
  if (buildRootHash) {
    const pinnedData = await ipfs.pin.add(buildRootHash.hash);
    console.log("\npinnedData: ", pinnedData);
    const publishedData = await ipfs.name.publish(buildRootHash.hash);
    console.log("\npublishedData: ", publishedData);
    console.log("\n", ipfsOptions.gatewayBase + publishedData.name);
  }
};

(async () => {
  // const data = await getData();
  // await uploadAllData(ipfs, data);
  // await simpleUpload();
  await testUpload(ipfs);
  // console.log("all done...");
})();
