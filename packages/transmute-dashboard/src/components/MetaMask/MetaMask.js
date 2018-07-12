import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import AppBar from '../AppBar';

import { withAuth } from '@okta/okta-react';
import { withStyles } from 'material-ui/styles';

import Typography from 'material-ui/Typography';
import theme from '../../theme';

import transmuteConfig from '../../transmute-config';

const styles = {
  card: {
    maxWidth: 500
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  media: {
    height: 200
  }
};

const Web3 = require('web3');

const getAccounts = someWeb3 => {
  return new Promise((resolve, reject) => {
    someWeb3.eth.getAccounts(async (err, accounts) => {
      if (err) {
        reject(err);
      } else {
        resolve(accounts);
      }
    });
  });
};
const getBalance = (someWeb3, someAddress) => {
  return new Promise((resolve, reject) => {
    someWeb3.eth.getBalance(someAddress, (err, balance) => {
      if (err) {
        reject(err);
      } else {
        resolve(balance.toNumber());
      }
    });
  });
};

const fundMetaMaskFromDefaultAccounts = async (amountETH, providerUrl) => {
  if (window.web3) {
    const metaMaskWeb3 = window.web3;
    const ganacheWeb3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

    let metaMaskAccounts = await getAccounts(metaMaskWeb3);
    let metaMaskAccountBalance = await getBalance(
      metaMaskWeb3,
      metaMaskAccounts[0]
    );

    console.log('unfunded account: ', {
      metaMaskAccounts,
      metaMaskAccountBalance
    });

    let defaultAccounts = await getAccounts(ganacheWeb3);

    let receipt = await ganacheWeb3.eth.sendTransaction({
      from: defaultAccounts[0],
      to: metaMaskAccounts[0],
      value: ganacheWeb3.toWei(amountETH, 'ether'),
      gasLimit: 21000,
      gasPrice: 20000000000
    });

    console.log(receipt);

    metaMaskAccountBalance = await getBalance(
      metaMaskWeb3,
      metaMaskAccounts[0]
    );

    console.log('funded account: ', {
      metaMaskAccounts,
      metaMaskAccountBalance
    });
  } else {
    console.log('MetaMask is not available, please install it.');
  }
};

class MetaMask extends Component {
  async componentWillMount() {
    if (window.web3) {
      try {
        let mmAccounts = await getAccounts(window.web3);
        let mmBalance = await getBalance(window.web3, mmAccounts[0]);
        if (mmBalance === 0) {
          await fundMetaMaskFromDefaultAccounts(
            1,
            transmuteConfig.web3Config.providerUrl
          );
        }

        this.setState({
          account: mmAccounts[0],
          balance: mmBalance
        });
      } catch (e) {
        alert('You must unlock your metamask account, and refresh.');
      }
    }
  }

  render() {
    return (
      <AppBar>
        <Typography gutterBottom variant="headline" component="h1">
          This page helps fund your MetaMask wallet.
        </Typography>
        <br />

        {!window.web3 && (
          <Typography gutterBottom variant="headline" component="h2">
            Please install and unlock metamask.
            <br />
            <br />
            <a href=" https://metamask.io/">https://metamask.io/</a>
          </Typography>
        )}
        {window.web3 && (
          <div>
            {' '}
            <br />
            Your metamask account details,{' '}
            <pre>{JSON.stringify(this.state, null, 2)}</pre>{' '}
            <Typography gutterBottom variant="headline" component="h1">
              If you are not connected to ganache, and need testnet ether for
              MetaMask, you can use this faucet:
              <br />
              <br />
              <a href="https://faucet.metamask.io/">
                https://faucet.metamask.io/
              </a>
            </Typography>
          </div>
        )}
      </AppBar>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    go: somePath => dispatch(push(somePath))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withAuth(MetaMask)));
