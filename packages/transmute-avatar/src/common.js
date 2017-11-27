const { readModel, reducer } = require("../src/ReadModels/PackageManager");

const getReadModel = async (T, eventStore, fromAddress) => {
  let updatedReadModel = await T.ReadModel.maybeSyncReadModel(
    eventStore,
    fromAddress,
    readModel,
    reducer
  );
  return updatedReadModel;
};

module.exports = {
  getPackageManagerReadModel: getReadModel
};
