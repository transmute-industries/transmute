import * as React from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-flexbox-grid'
import './Footer.css'
import { List, Icon } from 'semantic-ui-react'

const logo = require('../../../images/icons/logo.svg')

export class Footer extends React.Component<any, any> {
  state = {
    // display: false
  }

  render() {
    return (
      <div className="footer-container">
        <Grid fluid={true}>
          <Row>
            <Col xs={12} sm={3}>
              <a href="/">
                <img className="ti-footer-logo" src={logo} alt="logo" />
              </a>

              <p className="made-with">
                Made with <Icon disabled name="heart" style={{ color: '#38DDB4' }} />in Austin TX.
              </p>

              <p className="copyright">© 2017 Transmute Industries</p>

              <a
                className="f6s-button-a"
                href="https://www.f6s.com/transmuteindustriesllc?follow=1"
                target="_blank"
                title="Follow Transmute Industries, LLC on F6S"
              >
                <img className="f6s-button" src="https://www.f6s.com/images/f6s-follow-green.png" />
              </a>
            </Col>
            <Col xs={12} sm={3}>
              <h2>Company</h2>
              <List link>
                <List.Item as="a" href="https://transmute.industries/about">
                  About
                </List.Item>
                {/* <List.Item as='a'>Press</List.Item> */}
                {/* <List.Item as='a'>Careers</List.Item> */}
                <List.Item as="a" href="https://transmute.industries/contact">
                  Contact
                </List.Item>
                <List.Item as="a" href="https://transmute.industries/legal">
                  Legal
                </List.Item>
              </List>
            </Col>
            <Col xs={12} sm={3}>
              <h2>Community</h2>
              <List link>
                <List.Item as="a" href="https://austin-ethereum.slack.com" target="_blank">
                  <List.Icon name="slack" />
                  <List.Content>Slack</List.Content>
                </List.Item>

                <List.Item as="a" href="https://medium.com/@TransmuteNews" target="_blank">
                  <List.Icon name="comment outline" />
                  <List.Content>Blog</List.Content>
                </List.Item>

                <List.Item as="a" href="http://news.transmute.industries" target="_blank">
                  <List.Icon name="newspaper" />
                  <List.Content>News</List.Content>
                </List.Item>

                {/* <List.Item as='a'>
                  <List.Icon name='twitter' />
                  <List.Content>
                    Twitter
                  </List.Content>
                </List.Item> */}

                <List.Item as="a" href="https://www.linkedin.com/company/11186222/" target="_blank">
                  <List.Icon name="linkedin" />
                  <List.Content>LinkedIn</List.Content>
                </List.Item>

                {/* <List.Item as='a'>
                  <List.Icon name='facebook' />
                  <List.Content>
                    Facebook
                  </List.Content>
                </List.Item> */}
              </List>
            </Col>
            <Col xs={6} sm={3}>
              <h2>Customers</h2>
              <List link>
                <List.Item as="a" href="https://github.com/transmute-industries" target="_blank">
                  Download
                </List.Item>
                <List.Item as="a" href="https://framework.transmute.industries" target="_blank">
                  Documentation
                </List.Item>

                {/* <List.Item as='a'>Get Started</List.Item>
                <List.Item as='a'>Support</List.Item> */}
              </List>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default connect((state: any) => ({
  router: state.router,
}))(Footer as any)
