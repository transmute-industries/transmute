import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAuth } from '@okta/okta-react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import theme from '../../theme';

import { EventStoreFactory } from 'transmute-eventstore';

import * as actionsCreators from '../../store/user/actionCreators';

let eventStoreFactoryArtifact = require('../../contracts/EventStoreFactory.json');

let transmuteConfig = require('../../transmute-config');

const styles = {
  card: {
    maxWidth: 500,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  media: {
    height: 200,
  },
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      defaultEventStoreFactoryContractAddress: null,
      loading: true,
      account: this.props.user.web3Account
    };
  }

  async componentWillMount() {
    const eventStoreFactory = new EventStoreFactory({
      eventStoreFactoryArtifact,
      ...transmuteConfig
    });
    
    await eventStoreFactory.init();
    
    const eventStores = await eventStoreFactory.getEventStores();
    const accounts = await eventStoreFactory.getWeb3Accounts();

    this.setState({
      defaultEventStoreFactoryContractAddress:
        eventStoreFactory.eventStoreFactoryContractInstance.address,
        accounts,
        eventStores,
        eventStore: null,
        loading: false
    });
  }

  selectAccount = event => {
    this.setState({ account: event.target.value });
    this.props.setWeb3Account(event.target.value);
  };

  render() {
    if (this.state.loading) return null;
    const { classes } = this.props;

    return (
      <div>
        <Card className={classes.card}>
          {/* <CardMedia
            className={classes.media}
            image="../../static/images/transmute.logo.png"
            title="Transmute, Inc."
          /> */}
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              E-Signer Demo
            </Typography>
            <Typography component="p">
              In this demo, we'll be creating and signing documents with our Ethereum account.
            </Typography>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="uncontrolled-native">Account</InputLabel>
              <Select
                value={this.state.account == null ? this.state.accounts[0] : this.state.account}
                native
                defaultValue={30}
                onChange={this.selectAccount}
                input={<Input id="uncontrolled-native" />}
              >
                {this.state.accounts.map(account => (
                  <option
                    key={account}
                    value={account}
                    style={{
                      fontWeight:
                        (this.state.account !== null && this.state.account.indexOf(account) === -1)
                          ? theme.typography.fontWeightRegular
                          : theme.typography.fontWeightMedium,
                    }}>
                    {account}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="uncontrolled-native">EventStore</InputLabel>
              <Select
                value={this.state.eventStore == null ? this.state.eventStores[0] : this.state.eventStore}
                native
                defaultValue={30}
                onChange={this.selectEventStore}
                input={<Input id="uncontrolled-native" />}
              >
                {this.state.eventStores.map(eventStore => (
                  <option
                    key={eventStore}
                    value={eventStore}
                    style={{
                      fontWeight:
                        (this.state.eventStore !== null && this.state.eventStore.indexOf(eventStore) === -1)
                          ? theme.typography.fontWeightRegular
                          : theme.typography.fontWeightMedium,
                    }}>
                    {eventStore}
                  </option>
                ))}
              </Select>
            </FormControl>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              View Demo
          </Button>
            <Button
              size="small"
              color="primary"
              href={"/eventstorefactory/" + this.state.defaultEventStoreFactoryContractAddress}
            >
              Create EventStore
          </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setWeb3Account: async web3Account => {
      dispatch(actionsCreators.setWeb3Account(web3Account));
    }
  };
};

export default (connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withAuth(Dashboard))));