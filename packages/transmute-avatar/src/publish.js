// Transmute Avatar
// A package manager for typescript dapps and oracles built on top of npm.

const path = require("path");

module.exports = async (
  T,
  eventStore,
  fromAddress,
  packageDirectory
) => {
  // add the directory to IPFS
  // be careful that it does not have secrets!
  // in the future, this should respect npm and git ignore.
  let ipfsPackage = await T.TransmuteIpfs.addFromFs(packageDirectory);

  // get some fields from package.json
  let { name, version, description } = require(path.resolve(
    packageDirectory,
    "./package.json"
  ));

  // write a publish event to the store
  let savedEvent = await T.EventStore.writeFSA(eventStore, fromAddress, {
    type: "PACKAGE_PUBLISHED",
    payload: {
      name,
      version,
      ipfs: ipfsPackage
    }
  });

  // return a fsa style event
  return savedEvent;
};


