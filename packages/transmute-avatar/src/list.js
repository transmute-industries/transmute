// show all packages that have been published

const { getPackageManagerReadModel } = require("./common");

const readModelToList = (readModel) => {
// console.log(readModel.model)
}

const showPackageList = async (T, eventStore, fromAddress) => {
  let readModel = await getPackageManagerReadModel(T, eventStore, fromAddress);
  readModelToList(readModel)
}

module.exports = showPackageList;
