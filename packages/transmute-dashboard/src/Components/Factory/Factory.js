import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import transmute from '../../store/transmute';

import { LinearProgress } from 'material-ui/Progress';

import FactoryTour from '../FactoryTour';

class Factory extends React.Component {
  render() {
    // if (this.props.transmute.accounts === null) {
    //   return <LinearProgress color="secondary" />;
    // }
    return (
      <div className="Factory">
        <h3>Factory</h3>
        <FactoryTour
          transmute={this.props.transmute}
          actions={this.props.actions}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...state,
    transmute: state.transmute
  };
};

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(transmute.actionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Factory);
