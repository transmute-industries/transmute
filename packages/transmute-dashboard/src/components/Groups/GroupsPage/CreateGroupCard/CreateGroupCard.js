import React from 'react';
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

import { createGroup } from '../../../../store/transmute/middleware';

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
      description: '',
      error: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    let response = await createGroup(this.props.auth, this.state);
    if (response.data.error) {
      // TODO: Handle error states in UI
      this.setState({
        error: response.data.error
      });
    } else {
      // TODO: Call back to parent component and refresh groups
      this.setState({
        error: null,
        name: '',
        description: ''
      });
    }
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
          
        </CardContent>
        <CardActions>
          <Grid item md={12}>
            <Button
              variant="raised"
              color="secondary"
              onClick={this.handleSubmit}
              disabled={name.trim().length == 0 || description.trim().length == 0}
            >
              Create
            </Button>
          </Grid>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(withAuth(GroupCard));
