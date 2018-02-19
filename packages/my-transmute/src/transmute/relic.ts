const T = require('transmute-framework');
// import web3 from './web3';
declare var window: any;
export default new T.Relic(window.web3);
