import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#4b1c71',
    },
    secondary: {
      main: '#714ca5',
    },
    background: {
      default: '#fff0ff',
      paper: '#dbb6ee',
    },
    text: {
      primary: '#2b2b2b',
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  }
})

export default theme
