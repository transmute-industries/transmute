// https://material.io/color/#!/?view.left=0&view.right=0&secondary.color=651FFF&primary.color=006064

import { createMuiTheme } from 'material-ui/styles';
import {
  purple,
  red
  // colors
} from 'material-ui/colors';
import spacing from 'material-ui/styles/spacing';

// import { fade } from 'material-ui/styles/utils/colorManipulator';

export default createMuiTheme({
  spacing: spacing,
  palette: {
    primary: {
      light: purple['700'],
      main: purple['800'],
      dark: purple['900'],
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
