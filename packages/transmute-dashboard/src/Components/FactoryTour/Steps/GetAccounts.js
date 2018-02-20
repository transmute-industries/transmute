import React from 'react';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import transmute from '../../../store/transmute';

class GetAccounts extends React.Component {
  render() {
    return (
      <div className="GetAccounts">
        <Typography>Get your accounts from web3</Typography>

        <pre>
          Web3 Accounts:{' '}
          {JSON.stringify(this.props.transmute.accounts, null, 2)}
        </pre>

        <Button
          variant="raised"
          color="secondary"
          onClick={async () => {
            let accounts = await transmute.middleware.getWeb3Accounts();
            this.props.actions.setWeb3Accounts(accounts);
          }}
        >
          Get Web3 Accounts
        </Button>
      </div>
    );
  }
}

export default GetAccounts;
