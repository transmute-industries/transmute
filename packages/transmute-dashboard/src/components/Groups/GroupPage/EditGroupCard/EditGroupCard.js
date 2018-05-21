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
      selectedUser: '',
      error: null
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete = () => {
    this.props.onDelete();
  };

  render() {
    const { classes } = this.props;
    const { selectedUser } = this.state;

    return (
      <Card>
        <CardContent className={classes.root}>
          <Typography gutterBottom variant="headline" component="h2">
            Edit Group
          </Typography>
        </CardContent>
        <CardActions>
          <Grid item md={12}>
            <Button
              variant="raised"
              color="secondary"
              onClick={this.handleDelete}
            >
              Delete
            </Button>
          </Grid>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(withAuth(GroupCard));
