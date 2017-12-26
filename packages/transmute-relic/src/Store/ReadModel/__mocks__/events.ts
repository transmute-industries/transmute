import { IFSA } from "../../EventTypes";
import * as Constants from "./constants";

export default [
  {
    type: Constants.ACCOUNT_CREATED,
    payload: {
      timestamp: "1231231"
    },
    meta: {
      id: 0
    }
  },
  {
    type: Constants.ACCOUNT_NAMED,
    payload: {
      name: "dave"
    },
    meta: {
      id: 1
    }
  }
] as IFSA[];
