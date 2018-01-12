var sha1 = require("js-sha1");

var localStorage = window ? window.localStorage : null;

if (!window) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

module.exports = {
  getStorage: function() {
    return localStorage;
  },
  getItem: function(db, key) {
    return new Promise(function(resolve, reject) {
      resolve(JSON.parse(db.getItem(key)));
    });
  },
  setItem: function(db, value) {
    const valueAsJsonString = JSON.stringify(value);
    const key = sha1(valueAsJsonString).substring(0, 32); // not safe... consider guids here...
    return new Promise(function(resolve, reject) {
      db.setItem(key, valueAsJsonString);
      resolve(key);
    });
  }
};
