import React from 'react';
import _ from 'lodash';
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
import Select from 'material-ui/Select';
import theme from '../../../../theme';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingRight: 8,
    paddingLeft: 8,
    paddingTop: 20
  }),
  formControl: {
    minWidth: '600px'
  }
});

class GroupCard extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedUser: null,
      error: null
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddMember = this.handleAddMember.bind(this);
    this.handleRemoveMember = this.handleRemoveMember.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users) {
      this.setState({
        selectedUser: nextProps.users[0],
        error: null
      });
    }
  }

  handleDelete = () => {
    this.props.onDelete();
  };

  handleAddMember = () => {
    this.props.onAddMember(this.state.selectedUser.id);
  };

  handleRemoveMember = () => {
    this.props.onRemoveMember(this.state.selectedUser.id);
  };

  selectUser = async event => {
    await this.setState({
      selectedUser: _.find(this.props.users, { 'id': event.target.value })
    });
  };

  render() {
    const { classes, users, group } = this.props;
    const { selectedUser } = this.state;

    if (selectedUser == null || group.members == null) return null;
    const memberIds = group.members.map(member => member.id);

    return (
      <Card>
        <CardContent className={classes.root}>
          <Typography gutterBottom variant="headline" component="h2">
            Edit Group
          </Typography>

          <Grid item xs={5} md={12}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="uncontrolled-native">
                Add / Remove Member
                </InputLabel>
              <Select
                value={selectedUser.id}
                native
                defaultValue={30}
                onChange={this.selectUser}
                input={<Input id="uncontrolled-native" />}
              >
                {users.map(user => (
                  <option
                    key={user.id}
                    value={user.id}
                    style={{
                      fontWeight:
                        selectedUser.id !== user.id
                          ? theme.typography.fontWeightRegular
                          : theme.typography.fontWeightMedium
                    }}
                  >
                    {`${user.firstName} ${user.lastName}`}
                  </option>
                ))}
              </Select>
              {memberIds.indexOf(selectedUser.id) !== -1 &&
                <Button
                  variant="raised"
                  color="secondary"
                  onClick={this.handleRemoveMember}
                >
                  Remove Member
              </Button>}
              {memberIds.indexOf(selectedUser.id) == -1 &&
                <Button
                  variant="raised"
                  color="secondary"
                  onClick={this.handleAddMember}
                >
                  Add Member
              </Button>}
            </FormControl>
          </Grid>

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
