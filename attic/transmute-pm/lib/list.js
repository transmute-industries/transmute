// show all packages that have been published

const { getPackageManagerReadModel } = require("./common");

module.exports = async (T, eventStore, fromAddress) => {
  let readModel = await getPackageManagerReadModel(T, eventStore, fromAddress);
  return readModel;
};
