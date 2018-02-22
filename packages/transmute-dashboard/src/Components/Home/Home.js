import React from 'react';

import Typography from 'material-ui/Typography';

import Factory from '../Factory';

class Home extends React.Component {
  render() {
    return (
      <div className="Home">
        <h3>Transmute Alpha</h3>
        <p>
          This is a work in progress. Please{' '}
          <a
            href="https://github.com/transmute-industries/transmute/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            open an issue
          </a>{' '}
          on github if you encounter trouble using this demo.
        </p>

        <h4>What is the Transmute Alpha?</h4>
        <p>
          A static content hosting web app and cli tool built with the transmute
          framework. Content is stored on IPFS and tracked via an Ethereum smart
          contract known as the Event Store. This app supports two modes of
          development: centralized and decentralized.
        </p>

        <h4>Centralized Mode</h4>
        <p>
          In this mode, you visit alpha.transmute.industries, and interact with
          a web application that is hosted by transmute industries. This
          application uses IPFS and Ethereum, but you are not the node operator
          for either in this mode.
        </p>

        <h4>Decentralized Mode</h4>

        <Typography>
          In this mode, you visit localhost:3000, and interact with a web
          application that you are running locally. This application uses IPFS
          and Ethereum, and both are running locally with you as the operator.
        </Typography>
        <Factory />
      </div>
    );
  }
}

export default Home;
