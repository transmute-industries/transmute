import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import groups from '../store/transmute/groups';

const mapStateToProps = state => {
  return {
    groups: state.groups
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      groups: bindActionCreators(groups.actions, dispatch)
    }
  };
};

export default component => {
  return connect(mapStateToProps, mapDispatchToProps)(component);
};
