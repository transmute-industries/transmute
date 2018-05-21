import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
  withMobileDialog
} from 'material-ui/Dialog';

import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/github';


class ResponsiveDialog extends React.Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSave = () => {
    this.props.onSave(this.state.eventEditor);
    this.handleClose();
  };

  componentWillMount() {
    this.setState({
      eventEditor: JSON.stringify(this.props.defaultEvent, null, 2)
    });
  }

  render() {
    const { fullScreen } = this.props;

    return (
      <div>
        <Button
          color="secondary"
          variant="raised"
          onClick={this.handleClickOpen}
        >
          Record Event
        </Button>
        <Dialog
          fullScreen={fullScreen}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {'Record an Event'}
          </DialogTitle>
          <DialogContent>
            <AceEditor
              mode="json"
              theme="github"
              name="eventEditor"
              onChange={value => {
                this.setState({
                  eventEditor: value
                });
              }}
              value={this.state.eventEditor}
              editorProps={{ $blockScrolling: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Cancel
            </Button>

            <Button
              onClick={this.handleSave}
              color="secondary"
              variant="raised"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ResponsiveDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};

export default withMobileDialog()(ResponsiveDialog);
