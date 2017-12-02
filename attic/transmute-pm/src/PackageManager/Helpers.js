import T from "../transmute";

import { readModel, reducer } from "./Reducer";

export const getReadModel = async (T, eventStore, fromAddress) => {
  readModel.readModelStoreKey = `${readModel.readModelType}:${eventStore.address}`
  let updatedReadModel = await T.ReadModel.getCachedReadModel(
    eventStore,
    fromAddress,
    readModel,
    reducer
  );
  return updatedReadModel;
};

