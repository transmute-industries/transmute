import React from 'react';
import { connect } from 'react-redux';
import { withAuth } from '@okta/okta-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';

import withGroups from '../../../../containers/withGroups';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingRight: 8,
    paddingLeft: 8,
    paddingTop: 20
  })
});

class GroupCard extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      name: '',
      description: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    await this.props.actions.groups.createGroup(this.props.auth, this.state);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const { classes } = this.props;
    const { name, description } = this.state;

    return (
      <Card>
        <CardContent className={classes.root}>
          <Typography gutterBottom variant="headline" component="h2">
            Create Group
          </Typography>

          <Grid container style={{ marginBottom: '20px' }}>
            <Grid item md={12}>
              <FormControl className={classNames(classes.margin, classes.formControl)}>
                <InputLabel>Name</InputLabel>
                <Input
                  className={classNames(classes.textInput)}
                  id="name"
                  type="text"
                  value={name}
                  onChange={this.handleChange('name')}
                />
              </FormControl>
            </Grid>

            <Grid item md={12}>
              <FormControl className={classNames(classes.margin, classes.formControl)}>
                <InputLabel>Description</InputLabel>
                <Input
                  className={classNames(classes.textInput)}
                  id="description"
                  type="text"
                  value={description}
                  onChange={this.handleChange('description')}
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            variant="raised"
            color="secondary"
            onClick={this.handleSubmit}
            disabled={name.trim().length == 0 || description.trim().length == 0}
          >
            Create
          </Button>
        </CardActions>
      </Card>
    );
  }
}


export default withStyles(styles)(
  connect(null, null)(withAuth(withGroups(GroupCard)))
);
