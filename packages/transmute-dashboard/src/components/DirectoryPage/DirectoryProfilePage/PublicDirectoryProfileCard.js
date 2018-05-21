import React from 'react';

import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import Card, { CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';

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

class PublicDirectoryProfileCard extends React.Component {
  render() {
    const { profile, classes } = this.props;

    return (
      <Card>
        <CardContent className={classes.root}>
          <Typography gutterBottom variant="headline" component="h2">
            {profile.firstName} {profile.lastName}
          </Typography>

          <Typography gutterBottom variant="headline" component="h3">
            {profile.email}
          </Typography>

          <Grid item xs={12} md={6}>
            <pre>{profile.secPubKey}</pre>
          </Grid>
          <Grid item xs={12} md={6}>
            <pre>{profile.edPubKey}</pre>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(PublicDirectoryProfileCard);
