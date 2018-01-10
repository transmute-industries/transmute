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

export { Relic, Utils, TransmuteContracts, W3 }

export default Relic


// // Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// // import "core-js/fn/array.find"
// // ...

// import { W3 } from "soltsice";
// import { BigNumber } from "bignumber.js";

// import Relic from "./relic";

// import * as Utils from "./Utils";
// import * as FactoryModule from "./Factory";
// import * as StoreModule from "./Store";
// import * as TransmuteContracts from "./TransmuteContracts";

// export default {
//   Relic,
//   Utils,
//   TransmuteContracts,
//   W3
// };
