const TransmuteFramework = require('../lib/transmute-framework').default
const os = require('os')
const path = require('path')

const admin = require('firebase-admin')
const firebase = require('firebase')
require('firebase/firestore')

const DEVELOPMENT = {
  providerUrl: 'http://localhost:8545',
  TRANSMUTE_API_ROOT: 'http://localhost:3001',
}

let contractArtifacts = {
  aca: require('../build/contracts/RBAC'),
  esa: require('../build/contracts/RBACEventStore'),
  esfa: require('../build/contracts/RBACEventStoreFactory'),
}

const testSignatures = async () => {
  const accounts = await T.getAccounts()
  const address = accounts[0]
  const message = 'hello'
  const { messageBufferHex, signature } = await T.Toolbox.sign(address, message)
  let recoveredAddress = await T.Toolbox.recover(address, messageBufferHex, signature)
  console.log(address)
  console.log(recoveredAddress)
  if (address === recoveredAddress) {
    console.log('Success')
  } else {
    console.log('Failure')
  }
}

const testFirebaseLocal = async () => {
  const firebaseApp = firebase.initializeApp(require(path.join(os.homedir(), '.transmute/firebase-client-config.json')))
  let injectedConfig = Object.assign(DEVELOPMENT, contractArtifacts, {
    firebaseApp,
  })
  let T = TransmuteFramework.init(injectedConfig)
  let user = await T.Firebase.login()
  console.log(user.uid)
}

// https://github.com/transmute-industries/transmute-cli/issues/3
// BROKEN
const testFirestoreLocalClient = async () => {
  const firebaseApp = firebase.initializeApp(require(path.join(os.homedir(), '.transmute/firebase-client-config.json')))
  let injectedConfig = Object.assign(DEVELOPMENT, contractArtifacts, {
    firebaseApp,
  })
  let T = TransmuteFramework.init(injectedConfig)

  return T.db
    .collection('token_challenges')
    .get()
    .then(querySnapshot => {
      console.log(querySnapshot.docs[0].data())
    })
    .catch(err => {
      console.log(err)
    })
}

// https://github.com/transmute-industries/transmute-cli/issues/3
// WORKS
const testFirestoreLocalAdmin = async () => {
  let serviceAccount = require(path.join(os.homedir(), '.transmute/firebase-service-account.json'))
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
  let injectedConfig = Object.assign(DEVELOPMENT, contractArtifacts, {
    firebaseAdmin: admin,
  })
  let T = TransmuteFramework.init(injectedConfig)
  return T.db
    .collection('token_challenges')
    .get()
    .then(querySnapshot => {
      console.log(querySnapshot.docs[0].data())
    })
    .catch(err => {
      console.log(err)
    })
}

testFirebaseLocal()
