import { createMuiTheme } from '@material-ui/core/styles';
import { grey, yellow } from '@material-ui/core/colors';

const primaryColor = '#006230';
const secondaryColor = '#f06032';

export const lightGrey = grey[200];
export const darkGrey = grey[600];
export const warningColor = yellow[700];

const defaultTheme = createMuiTheme();

export default createMuiTheme({
  typography: {
    h1: {
      fontSize: 18,
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: primaryColor,
      contrastText: defaultTheme.palette.common.white,
    },
    secondary: {
      main: secondaryColor,
    },
  },
});
