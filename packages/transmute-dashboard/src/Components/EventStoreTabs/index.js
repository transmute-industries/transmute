import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/github';

function onChange(newValue) {
  console.log('change', newValue);
}

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 3,
    backgroundColor: theme.palette.background.paper
  }
});

class SimpleTabs extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Accounts" />
            <Tab label="Events" />
            <Tab label="ReadModels" />
          </Tabs>
        </AppBar>
        {value === 0 && (
          <TabContainer>
            <AceEditor
              width="100%"
              mode="json"
              theme="github"
              onChange={onChange}
              name="accounts"
              value={JSON.stringify(this.props.transmute.accounts, null, 2)}
              editorProps={{ $blockScrolling: true }}
            />
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer>
            <AceEditor
              width="100%"
              mode="json"
              theme="github"
              onChange={onChange}
              name="events"
              value={JSON.stringify(this.props.transmute.events, null, 2)}
              editorProps={{ $blockScrolling: true }}
            />
          </TabContainer>
        )}
        {value === 2 && (
          <TabContainer>
            <AceEditor
              width="100%"
              mode="json"
              theme="github"
              onChange={onChange}
              name="eventStore"
              value={JSON.stringify(this.props.transmute.eventStore, null, 2)}
              editorProps={{ $blockScrolling: true }}
            />
          </TabContainer>
        )}
      </div>
    );
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleTabs);
