var levelup = require("levelup");
var leveldown = require("leveldown");

var sha1 = require("js-sha1");

let db = levelup(leveldown("./level_db"));

const getStorage = () => {
  return db;
};

const getItem = (db, key) => {
  return new Promise((resolve, reject) => {
    db.get(key, (err, value) => {
      if (err) return reject(err);
      resolve(JSON.parse(value));
    });
  });
};

const setItem = (db, value) => {
  const valueAsJsonString = JSON.stringify(value);
  const key = sha1(valueAsJsonString).substring(0, 32); // not safe... consider guids here...
  return new Promise((resolve, reject) => {
    db.put(key, valueAsJsonString, function(err) {
      if (err) return reject(err);
      resolve(key);
    });
  });
};

module.exports = {
  getStorage,
  getItem,
  setItem
};
