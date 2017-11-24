import * as React from 'react'

import { Grid, Row, Col } from 'react-flexbox-grid'
import './Platform.css'

import { Button } from 'semantic-ui-react'
import { Menu } from 'semantic-ui-react'

import { connect } from 'react-redux'

import AceEditor from 'react-ace'

import 'brace/mode/javascript'
import 'brace/theme/monokai'

import { toast } from 'react-toastify'

import { TransmuteFramework } from '../../../../environment.web'
let T = TransmuteFramework

let commandEditor = `
import { 
  TransmuteFramework, 
  transmuteConfig 
} from "./environment.web";
const T = TransmuteFramework.init(transmuteConfig);

T.Firebase.login().then(user => {
  console.log(user);
  T.db
    .collection("RBACFactory")
    .get()
    .then(qs => {
      console.log(JSON.stringify(qs.docs[0].data(), null, 2))
    })
});

`

const demoEditor = ''
export class Platform extends React.Component<any, any> {
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

  async factoryDemo() {
    // const { EventStoreFactoryContract, Factory } = T

    // let addresses = await T.getAccounts()
    // let factory = await EventStoreFactoryContract.deployed()
    // console.log(addresses)
    // let user = await T.Firebase.login()
    // console.log(user.uid)
    // let state = await Factory.getFactoryReadModel(factory, addresses[0])
    // console.log(state)
    // let qs = await T.db.collection('RBACFactory').get()

    // console.log(JSON.stringify(qs.docs[0].data(), null, 2))

    this.setState({
      demoEditor: `
{
  "contractAddress": "0xbda2f140b2e3f6c103ee7759f8e341c048f8f82d",
  "lastEvent": null,
  "model": {},
  "readModelStoreKey": "RBACFactory:0xbda2f140b2e3f6c103ee7759f8e341c048f8f82d",
  "readModelType": "RBACFactory"
}
      `,
    })
  }

  async permissionsDemo() {
    // const { AccessControlContract, Permissions } = T
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
    //   })
    // return T.db.collection('token_challenges').get()
    // .then((querySnapshot: any) => {
    //   let first = querySnapshot.docs[0].data()
    //   console.log(JSON.stringify(first, null, 2))
    // })
    // this.setState({
    //   demoEditor: `
    //     {
    //       "client_address": "0x673ce6663bbd93fd52b30470e1ea906069f2e9cd",
    //       "client_message_raw": "0x463c9f35355622591c11ad0539fa0375209fdedf0726074c06769422a6206e49",
    //       "function_address": "0xb3e8cd78fa58dd9a1cec25486e212eea6fdd462e",
    //       "message_hex": "0xb184129ec0243a5e6f390ebc45bd3af7941a8ae54baa2d1437d9394c13827f8d",
    //       "message_raw": "402cd58a-dc52-4d06-8d0f-9bb48cf7d17b.0x673ce6663bbd93fd52b30470e1ea906069f2e9cd.0x463c9f35355622591c11ad0539fa0375209fdedf0726074c06769422a6206e49",
    //       "message_signature": "0xfb61bc75dbb6541d735e5fdeea0ae080b0dd7b6c320024f325351cafe5cac20b69338538e8e56a485bce5829ef057cd3910e1f141f7e166ee8b19bdf7675d4e401",
    //       "timestamp": 1508014039,
    //       "token_issued": true,
    //       "uuid": "402cd58a-dc52-4d06-8d0f-9bb48cf7d17b"
    //     }
    //         `,
    // })
  }
  async runDemoCode() {
    // console.log('running...')
    this.factoryDemo()
  }

  render() {
    const { activeItem } = this.state
    return (
      <Grid fluid={true}>
        <Row>
          <Col sm={12}>
            <h1>Platform</h1>
            <span className="ico-dots dot-header" />
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <p>
              Cloud functions power our services which read and write to the blockchain, often referred to as oracles.
              Build and deploy complex, cloud aware oracles and other blockchain related services. We provide a Firebase
              JSON Web Token login example to demonstrate how on chain and off chain security concepts can be blended.
            </p>
            <ul>
              <li>Cloud Functions</li>
              <li>Realtime & Document Database</li>
              <li>Authentication</li>
            </ul>
            <h3>Managing Secrets</h3>
            <p>
              In order to login to firebase, you will need to update: <br />
              <code>./functions/.transmute/environment.secret.env</code>
            </p>
            <code>
              {`
                GOOGLE_PROJECT_NAME="your-project" 
                WEB3_PROVIDER_URL="http://localhost:8545"
                TRANSMUTE_API_ROOT="http://localhost:3001"
                `}
            </code>
            <br />
            <br />

            <code>$ transmute serve</code>
            <br />
            <br />
            <p>
              Serve your cloud functions locally for easy development or manage your dapp without deploying anything to
              firebase! Use ngrok if you need to debug public internet callbacks, such as those for OAuth flows.
            </p>

            <h3>Read Model Queries</h3>
            <p>
              Analyze your smart contracts and their relationships with document database queries. Rebuild all read
              models from their immutable records stored on Ethereum and IPFS.
            </p>
          </Col>
          <Col lg={6}>
            <Button
              secondary
              onClick={() => {
                T.Firebase
                  .login()
                  .then((user: any) => {
                    let label = user.uid.substring(0, 16) + '...'
                    console.log(label)
                    toast.success('Welcome, ' + label)
                  })
                  .catch((err: any) => {
                    toast.error('Could not connect to login function.')
                    toast('Did you run transmute serve?')
                    throw err
                  })
              }}
            >
              Test Login
            </Button>

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
}))(Platform)
