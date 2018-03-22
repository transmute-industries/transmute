import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

import AppBar from '../AppBar';

import Button from 'material-ui/Button';

import IPFS from 'transmute-kepler';

import axios from 'axios';

import transmuteConfig from '../../transmute-config.json';

const config = transmuteConfig.dev.ipfs.config;

import Playground from 'playground-js-api'

var config = {...};
Playground.authenticate(config, "qsocks").then(function(ticket){
  config.ticket = ticket
  qsocks.ConnectOpenApp(config).then(function(result){
    //we're now connected
  });
});

class Kepler extends Component {
  render() {
    return (
      <AppBar>
        <Button
          variant="raised"
          color="secondary"
          onClick={async () => {
            const accessToken = await this.props.auth.getAccessToken();
            console.log(accessToken);

            // let ipfs = new IPFS({
            //   ...config,
            //   authorization: 'Bearer ' + accessToken,
            // });
            // let data = await axios
            // .create({
            //   baseURL: 'https://ipfs.transmute.minikube:32443',
            //   timeout: 1000,
            //   headers: { authorization: 'Bearer ' + accessToken }
            // })
            // .get('/api/v0/id');

            let data = await axios.get('http://localhost:5001/api/v0/id');

            console.log(data);

            // const nodeId = await ipfs.id();
            // console.log(nodeId);
          }}
        >
          Test IPFS
        </Button>

        <pre>{JSON.stringify(config, null, 2)}</pre>
      </AppBar>
    );
  }
}

export default withAuth(Kepler);
