// https://material.io/color/#!/?view.left=0&view.right=0&secondary.color=651FFF&primary.color=006064

import { createMuiTheme } from 'material-ui/styles';
import {
  deepPurple,
  red
  // colors
} from 'material-ui/colors';
import spacing from 'material-ui/styles/spacing';

// import { fade } from 'material-ui/styles/utils/colorManipulator';

export default createMuiTheme({
  spacing: spacing,
  
  typography: {
    fontFamily: 'Lato',
  },
  palette: {
    primary: {
      light: deepPurple['700'],
      main: deepPurple['700'],
      dark: deepPurple['900'],
      contrastText: '#fff'
    },
    secondary: {
      light: red['A200'],
      main: red['A400'],
      dark: red['A700'],
      contrastText: '#fff'
    },
    error: red
  }
});
