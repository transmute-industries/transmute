let FallbackLocalStorage = require('fallback-local-storage')
let appStorage
if (FallbackLocalStorage.getStorage().includes('localStorage')) {
  appStorage = localStorage
} else {
  appStorage = new FallbackLocalStorage()
}

export namespace LocalStore {
  // Auto detect supported storage adapter (default behavior)
  let store = appStorage

  /**
   * @param {String} key - a key for a stored object
   * @return {Object} a promise for the object at the given key
   */
  export const getItem = (key: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      let itemAsString: any = store.getItem(key)
      try {
        resolve(JSON.parse(itemAsString))
      } catch (e) {
        resolve(itemAsString)
      }
    })
  }
  /**
   * @param {String} key - a key for a stored object
   * @param {Object} value - the object to be stored
   * @return {Object} a promise for the object at the given key
   */
  export const setItem = (key: string, value: Object): Promise<any> => {
    return new Promise((resolve, reject) => {
      store.setItem(key, JSON.stringify(value))
      resolve(value)
    })
  }
}
