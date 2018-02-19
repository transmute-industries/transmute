import * as React from 'react';
// import relic from '../../transmute/relic';

// const T = require('transmute-framework') ;

import * as T from 'transmute-framework';

// { JSON.stringify(this.state.factory, null, 2)}

declare var window: any;
declare var web3: any;

import Button from 'material-ui/Button';

const Web3 = require('web3');
let web3js: any;

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3js = new Web3(web3.currentProvider);
  } else {
    console.debug('No web3? You should consider trying MetaMask!');
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    web3js = new Web3(
      new Web3.providers.HttpProvider('https://ropsten.infura.io')
    );
  }

  console.debug(web3js);

  // Now you can start your app & access web3 freely:
  // startApp()
});

class Factory extends React.Component {
  render() {
    return (
      <div className="Factory">
        FACTORY.....
        <Button
          variant="raised"
          color="primary"
          onClick={async () => {
            console.debug('adsfads');
            let accounts = await web3js.eth.getAccounts();
            let factory = await T.Factory.create(web3js, accounts[0]);
            console.debug(accounts);
            console.debug(factory);
          }}
        >
          Primary
        </Button>
      </div>
    );
  }
}

export default Factory;
