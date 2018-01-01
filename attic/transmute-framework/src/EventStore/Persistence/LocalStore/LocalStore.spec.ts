'use strict'
const moment = require('moment')

import { LocalStore } from './LocalStore'

describe('Persistence.LocalStore', () => {
  let key = 'a-valid-key'
  let value = {
    name: 'a valid value',
  }

  describe('.setItem', () => {
    it('returns a promise for the value in local storage', () => {
      return LocalStore.setItem(key, value).then((dataReadFromCache: any) => {
        expect(dataReadFromCache.name === value.name)
      })
    })
  })
  describe('.getItem', () => {
    it('returns a promise for the value in local storage', () => {
      return LocalStore.getItem(key).then((dataReadFromCache: any) => {
        expect(dataReadFromCache.name === value.name)
      })
    })
  })
})
