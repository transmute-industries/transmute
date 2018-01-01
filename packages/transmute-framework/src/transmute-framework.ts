// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import { W3 } from 'soltsice'
import { BigNumber } from 'bignumber.js'

export { Factory } from './Factory'
export { Store } from './Store'

import { transmuteWeb3, ITransmuteWeb3Config } from './web3'

import Relic from './relic'

export default Relic
