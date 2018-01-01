
import * as React from 'react';
import Particles from 'react-particles-js';
let particles = require('./particles.json');

import './Particle.css';

export class Particle extends React.Component<any, any> {
  render() {
    return (
      <div className="ti-particle">
        {this.props.children}
        <Particles
          params={{
            particles: particles.particles,
            interactivity: particles.interactivity
          }}
        />
      </div>
    );
  }
}
