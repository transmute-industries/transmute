import { IFSA } from '../../EventTypes'
import * as Constants from './constants'

export default [
  {
    type: Constants.ACCOUNT_CREATED,
    payload: {
      key: '1231231',
      value: 'asdfasd'
    },
    meta: {
      id: 0
    }
  },
  {
    type: Constants.ACCOUNT_NAMED,
    payload: {
      key: 'dave',
      value: 'fff'
    },
    meta: {
      id: 1
    }
  }
] as IFSA[]
