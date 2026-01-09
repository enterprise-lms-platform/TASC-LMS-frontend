import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import '@fontsource-variable/inter/opsz-italic.css'
import './index.css'
declare module '@mui/material/styles' {
  interface Shape {
    borderRadiusSm: number;
    borderRadiusMd: number;
    borderRadiusLg: number;
    borderRadiusXl: number;
  }

  interface ShapeOptions {
    borderRadiusSm?: number;
    borderRadiusMd?: number;
    borderRadiusLg?: number;
    borderRadiusXl?: number;
  }
}

const theme = createTheme({
  palette: {
    primary: { 
      main:'#ffb74d', 
      light: '#ffcc80',
      dark: '#ffa424',
      contrastText: '#fff',
    },
    secondary: { 
      main: '#3b82f6' 
    },
    success: { 
      main: '#10b981' 
    },
    warning: { 
      main: '#f59e0b' 
    },
    error: { 
      main: '#ef4444' 
    },
    info: { 
      main: '#3b82f6' 
    },

  },
    
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  spacing: [1, 2, 3, 4, 5, 6, 8,10, 12, 16, 20, 24], //calling theme.spacing(2, 5) will give 3px, and 6px  like an index
  shape: {
    borderRadius: 8,  //make sure to add interface above for these new shape properties to work.
    borderRadiusSm: 4,
    borderRadiusMd: 8,
    borderRadiusLg: 16,
    borderRadiusXl: 24,
  },
  
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* main App landing goes here */}
    </ThemeProvider>
  </StrictMode>,
)
