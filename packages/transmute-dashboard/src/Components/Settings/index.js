import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

import AppBar from '../AppBar';

import Button from 'material-ui/Button';

import axios from 'axios';

class Settings extends Component {
  render() {
    return (
      <AppBar>
        Settings..
        <Button
          variant="raised"
          color="secondary"
          onClick={async () => {
            const accessToken = await this.props.auth.getAccessToken();
            console.log(accessToken);

            let data = await axios
              .create({
                baseURL: '$KONG_NGROK_PROXY_URL',
                timeout: 1000
              })
              .get('/api/v0/id?jwt=' + accessToken);

            console.log(data);
          }}
        >
          Test IPFS
        </Button>
      </AppBar>
    );
  }
}

export default withAuth(Settings);
