import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import {
  Route,
  // Redirect
} from 'react-router'
// https://github.com/zilverline/react-tap-event-plugin
import * as injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { MuiThemeProvider, lightBaseTheme } from 'material-ui/styles'

import './index.css'

import { store, history } from './store/store'
// Now you can dispatch navigation actions from anywhere!
// store.dispatch(push('/foo'))

import HomePage from './components/Pages/Home/HomePage'

const lightMuiTheme = getMuiTheme(lightBaseTheme)

import { toast } from 'react-toastify'

import { TransmuteFramework, transmuteConfig } from './environment.web'
TransmuteFramework.init(transmuteConfig)

setTimeout(() => {
  if (TransmuteFramework.web3.currentProvider.currentBlock === null) {
    toast.error('Could not connect to Ethereum.')
    toast('Did you start testrpc?')
  } else {
    toast.success('Connected to Ethereum.')
  }
}, 500)

TransmuteFramework.TransmuteIpfs.ipfs
  .id()
  .then((data: any) => {
    toast.success('Connected to IPFS.')
  })
  .catch((err: any) => {
    toast.error('Could not connect to IPFS.')
    toast('Did you start ipfs?')
    throw err
  })

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider muiTheme={lightMuiTheme}>
        <div style={{ height: '100%' }}>
          <Route exact={true} path="/" component={HomePage} />
        </div>
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
