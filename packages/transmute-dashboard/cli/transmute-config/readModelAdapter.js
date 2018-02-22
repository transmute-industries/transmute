let localStorageAdapter = require('transmute-adapter-local-storage');
let localStorageDB = localStorageAdapter.getStorage();

const getReadModelAdapterAsync = async () => {
  const readModelAdapter = {
    getItem: id => {
      let item = JSON.parse(localStorageDB.getItem(id));
      return item ? item : null;
    },
    setItem: (id, value) => {
      return localStorageDB.setItem(id, JSON.stringify(value));
    }
  };

  return readModelAdapter;
};

module.exports = {
  getReadModelAdapterAsync
};
