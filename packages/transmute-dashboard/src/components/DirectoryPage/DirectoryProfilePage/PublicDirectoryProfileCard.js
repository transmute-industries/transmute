import React from 'react';

import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';

import Card, { CardContent } from 'material-ui/Card';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Grid from 'material-ui/Grid';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingRight: 8,
    paddingLeft: 8,
    paddingTop: 20
  }),
  margin: {
    margin: theme.spacing.unit,
  },
  formControl: {
    minWidth: '800px'
  }
});

class PublicDirectoryProfileCard extends React.Component {
  render() {
    const { profile, classes } = this.props;

    return (
      <Card>
        <CardContent className={classes.root}>
          <Grid item md={12}>
            <FormControl className={classNames(classes.margin, classes.formControl)}>
              <InputLabel>DID Document</InputLabel>
              <Input
                id="ed-public-key"
                type="text"
                disabled={true}
                multiline={true}
                value={JSON.stringify(JSON.parse(profile.didDocument), null, 2)}
              />
            </FormControl>
          </Grid> 
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(PublicDirectoryProfileCard);
