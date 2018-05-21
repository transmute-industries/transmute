import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import directory from '../store/transmute/directory';

const mapStateToProps = state => {
  return {
    directory: state.directory
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      directory: bindActionCreators(directory.actions, dispatch)
    }
  };
};

export default component => {
  return connect(mapStateToProps, mapDispatchToProps)(component);
};
