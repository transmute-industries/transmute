import React from 'react';
import _ from 'lodash';
import { withAuth } from '@okta/okta-react';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Card, { CardHeader, CardActions, CardContent } from 'material-ui/Card';
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
    minWidth: '100%'
  },
  gridPadding: {
    paddingRight: 20
  }
});

class GroupCard extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedUser: null,
      name: null,
      description: null,
      error: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleAddMember = this.handleAddMember.bind(this);
    this.handleRemoveMember = this.handleRemoveMember.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users && nextProps.group) {
      this.setState({
        selectedUser: nextProps.users[0],
        name: nextProps.group.name,
        description: nextProps.group.description,
        error: null
      });
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleDelete = () => {
    this.props.onDelete();
  };

  handleSave = () => {
    this.props.onSave({ name: this.state.name, description: this.state.description });
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
    const { selectedUser, name, description } = this.state;

    if (selectedUser == null || group.members == null) return null;
    const memberIds = group.members.map(member => member.id);

    return (
      <Grid container>
        <Grid item xs={6} md={4} lg={3} className={classes.gridPadding}>
          <Card>
            <CardHeader
              action={
                <IconButton
                  onClick={this.handleDelete}>
                  <DeleteIcon />
                </IconButton>
              }
              title="Edit Group"
            />
            <CardContent className={classes.root}>

              <FormControl className={classes.formControl}>
              <InputLabel>Name</InputLabel>
              <Input
                className={classNames(classes.textInput)}
                id="name"
                type="text"
                value={name}
                onChange={this.handleChange('name')}
              />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel>Description</InputLabel>
                <Input
                  className={classNames(classes.textInput)}
                  id="description"
                  type="text"
                  value={description}
                  onChange={this.handleChange('description')}
                />
              </FormControl>

            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={this.handleSave}
              >
                Save
            </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6} md={4} lg={3} className={classes.gridPadding}>
          <Card>
            <CardContent className={classes.root}>
              <Typography gutterBottom variant="headline" component="h2">
                Add / Remove Members
              </Typography>

              <FormControl className={classes.formControl}>
                <Select
                  value={selectedUser.id}
                  native
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
              </FormControl>

            </CardContent>
            <CardActions>
              {memberIds.indexOf(selectedUser.id) !== -1 &&
                <Button
                  size="small"
                  color="primary"
                  onClick={this.handleRemoveMember}
                >
                  Remove Member
              </Button>}
              {memberIds.indexOf(selectedUser.id) === -1 &&
                <Button
                  size="small"
                  color="primary"
                  onClick={this.handleAddMember}
                >
                  Add Member
              </Button>}
            </CardActions>
          </Card>
        </Grid>
        <Grid item md={4} lg={3}>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(withAuth(GroupCard));
