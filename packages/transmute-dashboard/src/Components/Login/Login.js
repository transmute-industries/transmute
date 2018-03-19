import React from 'react';
import { connect } from 'react-redux';

// https://auth0.com/docs/quickstart/spa/react/01-login

// import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
// import { bindActionCreators } from 'redux';

import auth0 from 'auth0-js';

class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'transmute-industries.auth0.com',
    clientID: 'CaY9019EZhmKbrVF8ngXxlSfy5gdV6b0',
    redirectUri: 'http://localhost:3000/callback',
    audience: 'https://transmute-industries.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid'
  });

  login() {
    this.auth0.authorize();
  }
}


class Login extends React.Component {
  render() {
    return (
      <div className="Status" style={{ height: '100%' }}>
        yolo...

         <Button variant="raised" color="secondary" onClick={()=>{
           const auth = new Auth();
          //  console.log('login....', auth)
           auth.login();
         }}>
          Login
        </Button>
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
  return {
    actions: {
      testFoo: () => {
        return 'bar bar';
      }
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
