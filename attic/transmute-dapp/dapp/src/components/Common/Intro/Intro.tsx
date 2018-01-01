import * as React from 'react'

// import { Grid, Image } from 'semantic-ui-react'

import './Intro.css'

import Setup from './Setup/Setup'

import Framework from './Framework/Framework'

import Platform from './Platform/Platform'
export default class Intro extends React.Component<any, any> {
  state = {}

  render() {
    return (
      <div className="intro-container">
        <Setup />
        <div className="ti-divider" />
        <Framework />
        <div className="ti-divider" />
        <Platform />
      </div>
    )
  }
}
