import * as React from 'react'

import { Grid, Row, Col } from 'react-flexbox-grid'
import './OracleRunner.css'

import { Button } from 'semantic-ui-react'
import { connect } from 'react-redux'

import AceEditor from 'react-ace'

import 'brace/mode/javascript'
import 'brace/mode/json'
import 'brace/theme/monokai'

let oracleCode: string = `
10 + 5
`
let oracleLog = ''

// import { store } from '../../../store/store'
// import { runOracleCode } from '../../../store/transmute/actions'

export class OracleRunner extends React.Component<any, any> {
  state = {
    oracleCode,
    oracleLog,
  }

  onOracleCodeChange = (_oracleCode: string) => {
    this.setState({
      oracleCode: _oracleCode,
    })
  }

  componentWillReceiveProps(nextProps: any) {
    console.log(nextProps)
    this.setState({
      oracleLog: JSON.stringify(nextProps.transmute.logs, null, '\t'),
    })
  }

  render() {
    return (
      <Grid className="oracle-runner" fluid={true}>
        <Row>
          <Col sm={12}>
            <h1>Oracle</h1>
            <span className="ico-dots dot-header" />
          </Col>
        </Row>
        <Row className="oracle-buttons">
          <Col sm={12}>
            <Button
              secondary
              onClick={() => {
                // store.dispatch(runOracleCode(this.state.oracleCode))
              }}
            >
              Run
            </Button>
          </Col>
        </Row>

        <Row className="oracle-code">
          <Col lg={6}>
            <AceEditor
              mode="javascript"
              theme="monokai"
              onChange={this.onOracleCodeChange}
              name="OracleCode"
              value={this.state.oracleCode}
              editorProps={{ $blockScrolling: true }}
            />
          </Col>
          <Col lg={6}>
            <AceEditor
              mode="json"
              theme="monokai"
              name="OracleLog"
              value={this.state.oracleLog}
              editorProps={{ $blockScrolling: true }}
            />
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default connect((state: any) => ({
  transmute: state.transmute,
}))(OracleRunner)
