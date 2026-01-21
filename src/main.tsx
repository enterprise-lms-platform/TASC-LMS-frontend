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
  // spacing: default 8px scaling is better
  // shape: {
  //   borderRadius: 8,  //make sure to add interface above for these new shape properties to work.
  //   borderRadiusSm: 4,
  //   borderRadiusMd: 8,
  //   borderRadiusLg: 16,
  //   borderRadiusXl: 24,
  // },
  
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
     
    </ThemeProvider>
  </StrictMode>,
)
