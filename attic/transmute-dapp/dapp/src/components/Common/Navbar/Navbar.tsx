import * as React from 'react'
import { Menu } from 'semantic-ui-react'

import './Navbar.css'
const logo = require('../../../images/icons/logo.svg')

import { push } from 'react-router-redux'

import { store } from '../../../store/store'
// Now you can dispatch navigation actions from anywhere!

export default class MenuExampleSecondaryPointing extends React.Component {
  state = { activeItem: 'home' }

  handleItemClick = (e: any, data: any) => {
    console.log('navigate: ', store)
    // if (data.name === '/contact') {
    //   window.open('https://transmute.typeform.com/to/hA411N');
    // } else {

    // }

    store.dispatch(push(data.name))

    // this.setState({ activeItem: data.name })
  }

  componentWillMount() {
    // console.log(window.location.pathname)
    this.setState({
      activeItem: window.location.pathname,
    })
  }

  render() {
    return (
      <div className="navbar">
        <Menu pointing secondary>
          <a href="https://transmute.industries">
            <img src={logo} className="App-logo" alt="logo" />
          </a>
          <Menu.Menu position="right" className="mobile hidden">
            <Menu.Item href="https://transmute.industries" name="Corporate" />
            <Menu.Item href="https://github.com/transmute-industries/transmute-dapp" name="Source" />
          </Menu.Menu>
        </Menu>
      </div>
    )
  }
}
