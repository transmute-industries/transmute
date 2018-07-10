{
  "localhost": {
    "mixpanelConfig": {
      "token": "a60c26145f8bb3734832daf2ab93024a",
      "optOutOfTracking": false
    },
    "ipfsConfig": {
      "host": "localhost",
      "port": 5001,
      "protocol": "http"
    },
    "web3Config": {
      "providerUrl": "http://localhost:8545"
    }
  },
  "minikube": {
    "mixpanelConfig": {
      "token": "a60c26145f8bb3734832daf2ab93024a",
      "optOutOfTracking": false
    },
    "ipfsConfig": {
      "host": "ipfs.transmute.minikube",
      "port": TPL_KONG_PORT_TPL,
      "protocol": "http"
    },
    "web3Config": {
      "providerUrl": "http://ganache.transmute.minikube:TPL_KONG_PORT_TPL"
    }
  },
  "transmute.network": {
    "mixpanelConfig": {
      "token": "a60c26145f8bb3734832daf2ab93024a",
      "optOutOfTracking": false
    },
    "ipfsConfig": {
      "host": "ipfs.transmute.network",
      "port": 443,
      "protocol": "https"
    },
    "web3Config": {
      "providerUrl": "https://ganache.transmute.network"
    }
  }
}
