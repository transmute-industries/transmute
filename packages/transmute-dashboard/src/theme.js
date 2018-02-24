// https://material.io/color/#!/?view.left=0&view.right=0&secondary.color=651FFF&primary.color=006064

import { createMuiTheme } from 'material-ui/styles';
import { teal, indigo, red } from 'material-ui/colors';
import spacing from 'material-ui/styles/spacing';


// import { fade } from 'material-ui/styles/utils/colorManipulator';

export default createMuiTheme({
  spacing: spacing,
  palette: {
    primary: teal,
    secondary: indigo,
    error: red
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
  }
});
