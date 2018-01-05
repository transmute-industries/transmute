const path = require("path");
const _ = require("lodash");

module.exports = vorpal => {
  let T = vorpal.T;
  
  const transmuteIpfsDeploy = async bindingModel => {
    let ti;
    if (bindingModel.env === "infura") {
      ti = T.TransmuteIpfs.init({
        host: "ipfs.infura.io",
        port: "5001",
        options: {
          protocol: "https"
        }
      });
    }
    if (bindingModel.env === "local") {
      ti = T.TransmuteIpfs.init();
    }
    if (!ti) {
      throw Error('transmuteIpfsDeploy requires env: "local"|"infura"');
    }
    return await ti.addFromFs(bindingModel.directory);
  };

  vorpal
    .command("ipfs deploy ", "Deploy a directory to ipfs")
    .option("-t, --target <directory>", "the directory you wish to deploy")
    .option("-e, --env <environment>", 'the env to deploy "local"|"infura"...')
    .types({
      string: ["directory", "environment"]
    })
    .action(async (args, callback) => {
      let results = await transmuteIpfsDeploy({
        env: args.options.env,
        directory: args.options.target
      });
      let pref =
        args.options.env === "local"
          ? "http://localhost:8080/ipfs/"
          : "https://ipfs.infura.io/ipfs/";
      results.forEach(res => {
        console.log("⚓  " + pref + res.hash + "\t" + res.path);
      });
      callback();
    });

  return vorpal;
};
