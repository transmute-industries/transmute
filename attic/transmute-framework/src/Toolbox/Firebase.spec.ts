'use strict'

import * as qs from 'querystring'

describe('Firebase misc test', () => {
  describe('query string works..', () => {
    it('work as expected', async () => {
      expect(
        qs.stringify({
          hello: true,
        })
      ).toBe('hello=true')
    })
  })
})
