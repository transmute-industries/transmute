import * as React from 'react'

import Particles from 'react-particles-js'

let particles = require('../Particle/particles.json')

import { Button } from 'semantic-ui-react'

export default class ParticleSplash extends React.Component<any, any> {
  state = {}
  render() {
    return (
      <div className="hero">
        <div className="particle-container">
          <Particles
            params={{
              particles: particles.particles,
              interactivity: particles.interactivity,
            }}
          />
        </div>
        <div className="hero-content">
          <h1>
            {' '}
            Fullstack Ethereum, <span>Advanced</span>.
          </h1>
          <h2 className="mobile hidden">Easily deploy cloud based ethereum applications.</h2>
          <Button
            secondary
            onClick={() => {
              window.scrollTo(0, 700)
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
    )
  }
}
