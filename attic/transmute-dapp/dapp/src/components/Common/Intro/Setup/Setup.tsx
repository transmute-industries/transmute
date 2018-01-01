import * as React from "react";

import { Grid, Row, Col } from "react-flexbox-grid";
import "./Setup.css";

// import { Button } from 'semantic-ui-react'
import { Menu } from "semantic-ui-react";

import { connect } from "react-redux";

import AceEditor from "react-ace";

import "brace/mode/markdown";
import "brace/theme/monokai";

let commandEditor = `


`;

const demoEditor = `
Download
----------------
git clone https://github.com/transmute-industries/transmute-dapp.git



Configure
----------------
- Open functions/.transmute
- Add/Update firebase-service-account.json
- Add/Update firebase-client-config.json 
- Update environment.secret.env 
- Update environment.node & environment.web



Develop
----------------
docker-compose up

`;

export class Setup extends React.Component<any, any> {
  state = {
    commandEditor,
    demoEditor,
    activeItem: "Basic"
  };

  onOracleAdvancedChange = (_oracleAdvanced: string) => {
    this.setState({
      oracleAdvanced: _oracleAdvanced
    });
  };

  componentWillReceiveProps(nextProps: any) {
    console.log(nextProps);
    this.setState({
      commandEditor: JSON.stringify(nextProps.transmute.logs, null, "\t")
    });
  }

  handleItemClick = (e: any, data: any) => {
    this.setState({ activeItem: data.name });
  };

  render() {
    const { activeItem } = this.state;
    return (
      <Grid fluid={true}>
        <Row>
          <Col sm={12}>
            <h1>Setup</h1>
            <span className="ico-dots dot-header" />
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <p>
              The Transmute CLI helps you build dapps and ethereum services
              quickly. Configure and deploy ethereum applications with Firebase.
            </p>
            <ul>
              <li>Web Application Hosting</li>
              <li>Serverless Cloud Functions</li>
              <li>Enterprise Ready Permissions System</li>
              <li>Comfortable Development Environment</li>
            </ul>

            <h4>dapp</h4>
            <p>react, redux, typescript, semantic ui & the transmute framework.</p>
            <h4>functions</h4>
            <p>develop firebase cloud functions locally with the transmute cli. </p>
            <h4>testrpc</h4>
            <p>ethereum development interface for building smart contracts.</p>
            <h4>ipfs</h4>
            <p>content addressable file system, for binaries, and objects.</p>
          </Col>
          <Col lg={6}>
            <Menu pointing secondary>
              <Menu.Item
                name="Basic"
                active={activeItem === "Basic"}
                onClick={this.handleItemClick}
              />
              {/* <Menu.Item
                name="Advanced"
                active={activeItem === "Advanced"}
                onClick={this.handleItemClick}
              /> */}
            </Menu>
            <div>
              {activeItem === "Advanced" ? (
                <AceEditor
                  mode="markdown"
                  theme="monokai"
                  name="commandEditor"
                  value={this.state.commandEditor}
                  editorProps={{ $blockScrolling: true }}
                />
              ) : (
                <AceEditor
                  mode="markdown"
                  theme="monokai"
                  name="demoEditor"
                  value={this.state.demoEditor}
                  editorProps={{ $blockScrolling: true }}
                />
              )}
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect((state: any) => ({
  transmute: state.transmute
}))(Setup);
