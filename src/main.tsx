import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import '@fontsource-variable/inter/opsz-italic.css'
import './index.css'
import App from './App'
declare module '@mui/material/styles' {
  
}

const theme = createTheme({

  typography: {
    fontFamily: 'SF Pro Display, Inter, sans-serif',
  },
  // breakpoints:{
  //   values: {
  //     xs: 575,
  //     sm: 769,
  //     md: 991,
  //     lg: 1025,
  //     xl: 1699,
  //   }
  // }
  
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
     
    </ThemeProvider>
  </StrictMode>,
)
