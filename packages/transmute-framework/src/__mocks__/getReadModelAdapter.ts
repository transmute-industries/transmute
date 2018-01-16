let nodeStorageAdapter = require('../../../transmute-adapter-node-storage')

let nodeStorageDB = nodeStorageAdapter.getStorage()

const Storage = require('node-storage')
const db = new Storage('./read_model_storage')

export const getDefaultReadModelAdapter = async () => {
  return {
    getItem: (id: string) => {
      return JSON.parse(db.get(id))
    },
    setItem: (id: string, value: any) => {
      return db.put(id, JSON.stringify(value))
    }
  }
}
