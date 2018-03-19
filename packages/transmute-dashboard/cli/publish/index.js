const transmute = require('../transmute-config');

module.exports = vorpal => {
  vorpal
    .command('publish <targetPath>', 'publish to ipfs')
    .types({ string: ['_'] })
    .action(async (args, callback) => {
      console.log('stubbed for now');

      // const ipfsConfig = transmute.ipfs.ipfsConfig;

      // let TI = new TransmuteIpfs(
      //   ipfsConfig.host,
      //   ipfsConfig.port,
      //   ipfsConfig.protocol
      // );
      // const ignorelist = await TI.getIgnoreList();
      // let results = await TI.addDirectory(args.targetPath, ignorelist);

      // console.log(results);

      callback();
    });
  return vorpal;
};
