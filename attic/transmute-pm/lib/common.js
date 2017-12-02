const { readModel, reducer } = require("./ReadModels/PackageManager");

const getReadModel = async (T, eventStore, fromAddress) => {
  let updatedReadModel = await T.ReadModel.maybeSyncReadModel(
    eventStore,
    fromAddress,
    readModel,
    reducer
  );
  return updatedReadModel;
};

const filterModelToLatest = readModel => {
  let onlyLatest = {};
  Object.keys(readModel.model).forEach(async packageKey => {
    let meta = readModel.model[packageKey];
    if (
      !onlyLatest[meta.name] ||
      onlyLatest[meta.name].version < meta.version
    ) {
      onlyLatest[meta.name] = meta;
      onlyLatest[meta.name].index = packageKey;
    }
  });
  return onlyLatest;
};

module.exports = {
  getPackageManagerReadModel: getReadModel,
  filterModelToLatest
};
