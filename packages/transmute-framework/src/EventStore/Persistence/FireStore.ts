import * as _ from 'lodash'

export default class FireStore {
  db: any
  constructor(db) {
    this.db = db
  }

  getItem(key: string) {
    // console.log('getItem deconstruct key to collection + id', key)
    let parts = key.split(':')
    let collectionType = parts[0]
    let docId = parts[1]
    return this.db
      .collection(collectionType)
      .doc(docId)
      .get()
      .then(doc => {
        return doc.data()
      })
      .catch((err: any) => {
        if (err) {
          console.log('failed to getItem from firestore', err)
        }
        return null
      })
  }

  setItem(key: string, value: any) {
    // console.log('setItem deconstruct key to collection + id', key)
    let parts = key.split(':')
    let collectionType = parts[0]
    let docId = parts[1]
    console.log('setting read model')
    if (
      !_.every(
        _.map([value.readModelType, value.contractAddress], value => {
          return value !== undefined && value !== null && value !== ''
        })
      )
    ) {
      throw Error('readModel missing readModelType or contractAddress. ' + JSON.stringify(value))
    }
    return this.db.collection(collectionType).doc(docId).set(value).catch((err: any) => {
      if (err) {
        console.log('failed to setItem to firestore', err)
      }
      return null
    })
  }
}
