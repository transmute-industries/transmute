let nodeStorageAdapter = require('transmute-adapter-node-storage')
let nodeStorageDB = nodeStorageAdapter.getStorage()

const Storage = require('node-storage')
const db = new Storage('./read_model_storage')

module.exports = {
    getItem: (id) => {
      return JSON.parse(db.get(id))
    },
    setItem: (id, value) => {
      return db.put(id, JSON.stringify(value))
    }
  }
