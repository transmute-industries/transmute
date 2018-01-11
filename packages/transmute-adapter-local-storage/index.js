var sha1 = require("js-sha1");

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

const getStorage = () => {
  return localStorage;
};

const getItem = (db, key) => {
  return new Promise((resolve, reject) => {
    resolve(JSON.parse(db.getItem(key)));
  });
};

const setItem = (db, value) => {
  const valueAsJsonString = JSON.stringify(value);
  const key = sha1(valueAsJsonString).substring(0, 32); // not safe... consider guids here...

  return new Promise((resolve, reject) => {
    db.setItem(key, valueAsJsonString);
    resolve(key);
  });
};

module.exports = {
  getStorage,
  getItem,
  setItem
};
