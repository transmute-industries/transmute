// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import { W3 } from 'soltsice'
import { BigNumber } from 'bignumber.js'

import Relic from './relic'

export * from './Factory'
export * from './Store'

import * as Utils from './Utils'
import * as TransmuteContracts from './TransmuteContracts'
export * from './TransmuteContracts'

export { Relic, Utils, TransmuteContracts }

export default Relic
