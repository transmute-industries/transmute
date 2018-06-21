import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from 'material-ui/Button';
import GridList, { GridListTile } from 'material-ui/GridList';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';

const styles = theme => ({
  image: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  root: theme.mixins.gutters({
    paddingRight: 8,
    paddingLeft: 8,
    paddingTop: 20
  }),
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
  },
  spacer: {
    flex: '1 1 100%',
    height: 20
  },
  title: {
    paddingBottom: 20
  }
});

class DocumentsList extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.documents && nextProps.signature) {
      this.setState({
        documents: nextProps.documents,
        signature: nextProps.signature
      });
    }
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      documents: props.documents,
      signature: props.signature
    };
  }

  handleDocumentUpload = (event) => {
    this.props.onDocumentUpload(event);
  };

  handleSignDocument = (documentHash) => {
    this.props.onDocumentSign(documentHash);
  };

  render() {
    const { classes } = this.props;
    const { documents, signature } = this.state;

    return (
      <Card>
        <CardContent className={classes.root}>
          <Typography variant="title" component="h2" className={classes.title}>
            Documents
            </Typography>
          {_.map(documents, (value, key) => (
            <ExpansionPanel key={key}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>{value.name}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <GridList className={classes.gridList}>
                  {value.signatures.map(signature => (
                    <GridListTile key={signature} href={'https://ipfs.infura.io/api/v0/cat?arg=' + signature}>
                      <img src={'https://ipfs.infura.io/api/v0/cat?arg=' + signature} className={classes.image} alt={signature} />
                    </GridListTile>
                  ))}
                </GridList>
              </ExpansionPanelDetails>
              <Button color="primary" href={'https://ipfs.infura.io/api/v0/cat?arg=' + key} target="_blank">
                View Document
              </Button>
              {signature !== null && value.signatures.indexOf(signature) === -1 &&
                <Button
                  color="secondary"
                  onClick={() => this.handleSignDocument(key)}
                >
                  Sign
                </Button>
              }
            </ExpansionPanel>
          ))}
        </CardContent>
        { signature !== null &&
          <CardActions>
            <input
              id="documentFile"
              type="file"
              onChange={this.handleDocumentUpload}
              style={{
                width: 0,
                height: 0,
                opacity: 0,
                overflow: 'hidden',
                position: 'absolute',
                zIndex: 1,
              }}
            />
            <Button
              color="secondary"
              component="label"
              htmlFor="documentFile"
              disabled={signature === null}
            >
              Upload New Document
              </Button>
          </CardActions>
        }
      </Card>
    );
  }
}

DocumentsList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DocumentsList);