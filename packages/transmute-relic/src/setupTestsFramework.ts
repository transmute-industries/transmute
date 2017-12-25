import { W3 } from 'soltsice'
import { getSetupAsync } from "./Store/__mocks___/store";
declare var global: any;
global.window = {};

getSetupAsync().then(setup => {
  global.setup = setup
  global.window.web3 = setup.relic.web3
  W3.Default = global.window.web3
});
