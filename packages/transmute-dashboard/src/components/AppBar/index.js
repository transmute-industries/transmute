import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Menu, { MenuItem } from 'material-ui/Menu';
import OktaAuthButton from '../Auth/OktaAuthButton';
import * as actionCreators from '../../store/transmute/user/actionCreators';
import { LinearProgress } from 'material-ui/Progress';

import Button from 'material-ui/Button';

import { withAuth } from '@okta/okta-react';

import PrimaryMenu from './PrimaryMenu';
import SecondaryMenu from './SecondaryMenu';

import { history } from '../../store';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    // marginTop: theme.spacing.unit * 3,
    zIndex: 1,
    overflow: 'hidden'
  },
  loginButton: {
    marginRight: '10px'
  },
  flex: {
    flex: 1
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%'
  },
  appBar: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  hide: {
    display: 'none'
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    width: 60,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  drawerInner: {
    // Make the items inside not wrap when transitioning:
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  content: {
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: 24,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64
    },
    overflow: 'scroll'
  }
});

class MiniDrawer extends React.Component {
  state = {
    authenticated: false,
    isDrawerOpen: false
  };

  handleDrawerOpen = () => {
    this.setState({ isDrawerOpen: true });
  };

  handleDrawerClose = () => {
    this.setState({ isDrawerOpen: false });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  constructor(props) {
    super(props);
    this.state = { authenticated: null };
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  render() {
    const { classes, theme } = this.props;
    const { authenticated, anchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    const isLoading = !!this.props.loading;

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar
            className={classNames(
              classes.appBar,
              this.state.isDrawerOpen && classes.appBarShift
            )}
          >
            <Toolbar disableGutters={!this.state.isDrawerOpen}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(
                  classes.menuButton,
                  this.state.isDrawerOpen && classes.hide
                )}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                onClick={() => {
                  history.push('/');
                }}
                style={{ cursor: 'pointer' }}
                variant="title"
                color="inherit"
                noWrap
                className={classNames(classes.flex)}
              >
                Transmute
              </Typography>
              {!authenticated && (
                <div style={{ paddingRight: '10px' }}>
                  <Button
                    variant="raised"
                    color="primary"
                    onClick={() => {
                      history.push('/register');
                    }}
                    className={classes.loginButton}
                  >
                    Register
                  </Button>
                  <OktaAuthButton />
                </div>
              )}

              {authenticated && (
                <div>
                  <IconButton
                    aria-owns={isMenuOpen ? 'menu-appbar' : null}
                    aria-haspopup="true"
                    onClick={this.handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                    open={isMenuOpen}
                    onClose={this.handleClose}
                  >
                    <MenuItem
                      onClick={() => {
                        history.push('/profile');
                      }}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        this.props.logoutUser();
                        this.props.auth.logout();
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </Toolbar>
            { isLoading && <LinearProgress color="primary" /> }
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(
                classes.drawerPaper,
                !this.state.isDrawerOpen && classes.drawerPaperClose
              )
            }}
            open={this.state.isDrawerOpen}
          >
            <div className={classes.drawerInner}>
              <div className={classes.drawerHeader}>
                <IconButton onClick={this.handleDrawerClose}>
                  {theme.direction === 'rtl' ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
                </IconButton>
              </div>
              <Divider />
              {this.state.authenticated && <PrimaryMenu />}
              <SecondaryMenu />
            </div>
          </Drawer>
          <main className={classes.content}>{this.props.children}</main>
        </div>
      </div>
    );
  }
}

MiniDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    // sessionToken: state.user.sessionToken,
    error: state.user.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logoutUser: () => dispatch(actionCreators.logout())
  };
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(withAuth(MiniDrawer))
);
