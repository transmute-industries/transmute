const { registerMethod } = require('did-resolver');
const dli = require('./tst-decentralized-ledger-interface.js')

const resolve = (did) => {
    return dli.read(did); 
}

const register = () => {
    registerMethod('tst', resolve)
}

module.exports = register
