
import * as Constants from './constants'

export default [
  {
    type: Constants.ACCOUNT_CREATED,
    payload: {
      key: 'created',
      value: '03002028'
    },
    meta: {
      id: 0
    }
  },
  {
    type: Constants.ACCOUNT_NAMED,
    payload: {
      key: 'name',
      value: 'dave'
    },
    meta: {
      id: 1
    }
  }
]
