var sha1 = require("js-sha1");
var Storage = require("node-storage");
var store = new Storage("./node_storage");

const getStorage = () => {
  return store;
};

const getItem = (db, key) => {
  return new Promise((resolve, reject) => {
    resolve(JSON.parse(db.get(key)));
  });
};

const setItem = (db, value) => {
  const valueAsJsonString = JSON.stringify(value);
  const key = sha1(valueAsJsonString).substring(0, 32); // not safe... consider guids here...

  return new Promise((resolve, reject) => {
    store.put(key, valueAsJsonString);
    resolve(key);
  });
};

module.exports = {
  getStorage,
  getItem,
  setItem
};
