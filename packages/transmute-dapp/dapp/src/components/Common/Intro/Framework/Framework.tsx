import * as React from 'react'

import { Grid, Row, Col } from 'react-flexbox-grid'
import './Framework.css'

// import { Button } from 'semantic-ui-react'
import { Menu } from 'semantic-ui-react'

import { connect } from 'react-redux'

import AceEditor from 'react-ace'

// import { TransmuteFramework, transmuteConfig } from '../../../../environment.web'

import 'brace/mode/javascript'
import 'brace/mode/json'
import 'brace/theme/monokai'

let commandEditor = `
const T = TransmuteFramework.init(transmuteConfig);
const { AccessControlContract, Permissions } = T;

AccessControlContract.deployed().then((acc) =>{
  return Permissions.setAddressRole(
    acc, 
    fromAddress, 
    account_addresses[1], 
    'admin'
  );
}).then((txWithEvents) =>{
  return Permissions.setGrant(
    acc, 
    fromAddress, 
    'admin', 
    'eventstore', 
    'create:any', 
    ['*']
  );
}).then((txWithEvents) =>{
  return Permissions.getPermissionsReadModel(
    acc, 
    fromAddress
  );
}).then((readModel) =>{
  console.log(readModel);
})
`

const demoEditor = ''
export class Framework extends React.Component<any, any> {
  state = {
    commandEditor,
    demoEditor,
    activeItem: 'code',
  }

  handleItemClick = (e: any, data: any) => {
    if (data.name === 'result') {
      this.runDemoCode()
    }
    this.setState({ activeItem: data.name })
  }

  async runDemoCode() {
    // console.log('running result code...', T)
    // const { AccessControlContract, Permissions } = T
    // let addresses = await T.getAccounts()
    // let acc: any
    // AccessControlContract.deployed()
    //   .then((_acc: any) => {
    //     acc = _acc
    //     return Permissions.setAddressRole(acc, addresses[0], addresses[1], 'admin')
    //   })
    //   .then((txWithEvents: any) => {
    //     return Permissions.setGrant(acc, addresses[0], 'admin', 'eventstore', 'create:any', ['*'])
    //   })
    //   .then((txWithEvents: any) => {
    //     return Permissions.getPermissionsReadModel(acc, addresses[0])
    //   })
    //   .then((readModel: any) => {
    //     console.log(readModel)
    //     this.setState({ demoEditor: JSON.stringify(readModel, null, 2) })
    //   })

    let result = `
{
  "readModelStoreKey": "Permissions:0xe11f17b42505131b6a4fb9c502bb669904a8885c",
  "readModelType": "Permissions",
  "contractAddress": "0xe11f17b42505131b6a4fb9c502bb669904a8885c",
  "lastEvent": 10,
  "model": {
    "admin": {
      "eventstore": {
        "create:any": [
          "*"
        ]
      }
    }
  }
}
    `
    this.setState({ demoEditor: result })
  }

  render() {
    const { activeItem } = this.state
    return (
      <Grid fluid={true}>
        <Row>
          <Col sm={12}>
            <h1>Framework</h1>
            <span className="ico-dots dot-header" />
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <p>
              The Transmute Framework is a javascript library (node.js and browser) which provides an event sourced
              smart contract development system, powered by Solidity and TypeScript. Events are stored in IPFS and added
              to Ethereum through simple interfaces familiar to many Redux developers. Reducers convert events into JSON
              documents called read models. Read models are stored in Firestore, a document database which supports
              complex queries.
            </p>
            <ul>
              <li>EventStore & Audit Log</li>
              <li>IPFS Integration</li>
              <li>Common Redux Patterns</li>
            </ul>

            <h3>EventStore</h3>
            <p>An event sourced smart contract with an immutable audit log.</p>

            <h3>Permissions</h3>
            <p>An example role based access control contract built with the EventStore.</p>
          </Col>
          <Col lg={6}>
            <Menu pointing secondary>
              <Menu.Item name="code" active={activeItem === 'code'} onClick={this.handleItemClick} />
              <Menu.Item name="result" active={activeItem === 'result'} onClick={this.handleItemClick} />
            </Menu>
            <div>
              {activeItem === 'code' ? (
                <AceEditor
                  mode="javascript"
                  theme="monokai"
                  name="commandEditor"
                  value={this.state.commandEditor}
                  editorProps={{ $blockScrolling: true }}
                />
              ) : (
                <AceEditor
                  mode="json"
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
    )
  }
}

export default connect((state: any) => ({
  transmute: state.transmute,
}))(Framework)
