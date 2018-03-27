// https://material.io/color/#!/?view.left=0&view.right=0&secondary.color=651FFF&primary.color=006064

import { createMuiTheme } from 'material-ui/styles';
import {
  deepOrange,
  indigo,
  red
  // colors
} from 'material-ui/colors';
import spacing from 'material-ui/styles/spacing';

// import { fade } from 'material-ui/styles/utils/colorManipulator';

export default createMuiTheme({
  spacing: spacing,
  palette: {
    primary: {
      light: indigo['400'],
      main: indigo['700'],
      dark: indigo['900'],
      contrastText: '#fff'
    },
    secondary: {
      light: deepOrange['300'],
      main: deepOrange['500'],
      dark: deepOrange['900'],
      contrastText: '#fff'
    },
    error: red
  }
});
