import { ITransmuteFramework } from '../../transmute-framework'

import { LocalStore } from './LocalStore/LocalStore'
import FireStore from './FireStore'

export default class Persistence {
  store: any
  constructor(public framework: ITransmuteFramework) {
    if (!framework.db) {
      this.store = LocalStore
    } else {
      this.store = new FireStore(this.framework.db)
    }
  }

  get(key: string) {
    return this.store.getItem(key)
  }

  set(key: string, value: any) {
    return this.store.setItem(key, value)
  }
}
