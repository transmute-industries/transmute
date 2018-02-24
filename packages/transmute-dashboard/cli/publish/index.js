const transmute = require('../transmute-config');

const TransmuteIpfs = require('transmute-ipfs');

module.exports = vorpal => {
  vorpal
    .command('publish <targetPath>', 'publish to ipfs')
    .types({ string: ['_'] })
    .action(async (args, callback) => {
    
      const ipfsConfig = transmute.ipfs.ipfsConfig;

      let TI = new TransmuteIpfs(
        ipfsConfig.host,
        ipfsConfig.port,
        ipfsConfig.protocol
      );
      const ignorelist = await TI.getIgnoreList();
      let results = await TI.addDirectory(args.targetPath, ignorelist);

      console.log(results);

      callback();
    });
  return vorpal;
};
